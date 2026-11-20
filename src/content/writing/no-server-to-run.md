---
title: No server to run
description: Deskline, the remote desktop I made to replace AnyDesk
date: 2026-11-20
metaTitle: "No server to run: a remote desktop in Rust over iroh"
metaDescription: How Deskline, a remote desktop app in Rust, uses each computer's Ed25519 public key as its address, dials it over iroh QUIC with hole punching and a relay fallback, and keeps a round trip's worth of frames in flight.
seed: 118
---

I started Deskline as the smallest thing that could replace AnyDesk when I help family and friends: a remote desktop with no account and no server to run. AnyDesk gives each computer a 9-digit number from its own servers. Deskline has no server handing out numbers, so a computer's code is its public key, and you copy and paste it.

It wasn't the first thing I built that way. Five days before Deskline's first commit, I started PartyLine, and most of what Deskline stands on came from there.

## Where it started

PartyLine is a party game show that runs in your terminal. One person hosts, friends join over the LAN or the internet with an invite code, and everyone plays a run of minigames in a basement rendered in Blender and baked down to the terminal.

Joining a room needed the same thing Deskline needed later: two computers that find each other across the internet, with no server of mine and no port forwarding. PartyLine does it with [iroh](https://github.com/n0-computer/iroh): QUIC connections dialed by public key, hole punching, a relay when there's no direct path, and mDNS on the local network. Its README calls that the built-in virtual LAN.

Deskline sets up its endpoint the same way, with one line more:

```rust title="src/net.rs" {2}
let ep = Endpoint::builder(presets::N0)
    .secret_key(identity(home)?)
    .alpns(vec![ALPN.to_vec()])
    .bind()
    .await?;
let mdns = MdnsAddressLookup::builder().build(ep.id())?;
ep.address_lookup()?.add(mdns);
```

PartyLine makes a new key every time it starts, so an invite code lasts as long as the game is open. Deskline writes its key to a file the first time and reads it back from then on, so a computer's code never changes.

The rest came along too. Bumping the version in `Cargo.toml` and pushing builds every platform in GitHub Actions and publishes the release, and installed copies update themselves from it. PartyLine draws every word as pixel type and its art through an ordered dither, and the lines, my apps that only need a code or a link, kept both. The day after Deskline's first commit, Sightline started:

| Line | First commit | What it is |
| --- | --- | --- |
| PartyLine | November 12 | A party game show in your terminal |
| Deskline | November 17 | Remote desktop with no server to run |
| Sightline | November 18 | Your screen as a link, live in the browser |

## The code is the key

An iroh endpoint is named by its Ed25519 public key, 32 bytes. Deskline writes it in z-base-32, an alphabet made for people to read, with no 0, l, v or 2 to mix up. Five bits a character makes 52 characters, shown in groups of four:

```rust title="src/net.rs"
pub fn code(id: EndpointId) -> String {
    let z = id.to_z32();
    z.as_bytes().chunks(4).map(|c| std::str::from_utf8(c).unwrap()).collect::<Vec<_>>().join(" ")
}
```

On the home screen the 13 groups go in three lines of five, five and three, so a lone group never dangles at the end. Here's one made by your browser just now, a real Ed25519 key written the way Deskline writes them:

```line
code
```

Whoever needs help copies their code and sends it to you. You paste it, and Deskline keeps it under Recent with a name you choose.

The connection is QUIC with TLS keyed to that key, so you reach the computer whose code you pasted, and nothing in between can read or change the session, the relays included. Those are n0's public relays: they help two computers find each other, and carry the encrypted traffic when there's no direct path.

## Who gets in

A code alone gets you nothing. A session starts on a click on Accept, on the unattended-access password, or because the other person ticked Always allow you before. Let them control comes ticked, the way AnyDesk's accept window does; untick it and it's view only.

While someone is in, the computer being helped shows a red bar with Chat, Take back control and Stop sharing. It stays above every other window, even while Deskline is minimized.

## Frames in flight

The first version sent the screen as H.264 and had the viewer ack every frame. The host kept at most two frames unacked, so a slow link dropped frames instead of piling up delay.

Two is plenty on the same network. Across the internet it's a ceiling: two frames per round trip, so with 200 milliseconds between the computers, ten frames a second arrive, however fast the link is. The next day the limit became a round trip's worth of frames, capped at 8, and since 0.5.0, when the frame rates went past 60, at 32:

```rust title="src/host.rs" {1}
let in_flight = (net::rtt(&conn).as_millis() / gap.as_millis() + 2).clamp(2, 32) as u32;
while seq.wrapping_sub(*acked.borrow_and_update()) >= in_flight {
    acked.changed().await?;
}
```

`gap` is the time between two frames: 33 milliseconds at the 30 frames a second Deskline sends a desktop at. A 200-millisecond round trip lets 8 frames be on their way at once, enough that the host never stops to wait while the link keeps up. Drag the round trip and switch between the two rules:

```line
inflight
```

Waiting is also how the host learns the link is full. It adds up how long it waited for acks each second. Past 300 milliseconds, it asks the encoder for 30% fewer bits. Under 50 for three seconds in a row, it starts asking for 15% more each second, back up to the quality's full rate:

```rust title="src/host.rs"
if blocked > Duration::from_millis(300) {
    rate = (rate * 0.7).max(0.1);
    calm = 0;
    enc.set_rate(rate);
} else if blocked < Duration::from_millis(50) && rate < 1.0 {
    calm += 1;
    if calm >= 3 {
        rate = (rate * 1.15).min(1.0);
        enc.set_rate(rate);
    }
}
```

Deskline never tests the bandwidth. The acks count frames, not bytes, and a comment above that line says when to change that: if 4K frames ever fill a link's buffers, count bytes instead, the bitrate times the round trip.

## Pictures that stay on the GPU

The encoder is OpenH264, compiled in, or the graphics card's own when there is one. On Windows, through Media Foundation, the picture goes from capture to the encoder without leaving the GPU. On Linux, GStreamer has the GPU scale and convert it, with NVENC, or VA-API on Intel and AMD.

For games and video there's Native: the screen at its own size, up to 4K, and its own refresh rate, up to 240 frames a second. It never gets smaller. When the link or the computer can't keep up, fewer frames come instead.

A picture that goes still for 200 milliseconds is encoded again, up to eight times, so text blurred by the motion before it sharpens. It stops early once a re-encode comes out under 512 bytes: that one is as sharp as it gets.

## The dusk

Deskline started out with the look of egui, the Rust interface library it's built on, blue accents and all. In 0.3.0 I moved it to this site's system, and that's where I made the lines' visual identity: a 32 by 32 pixel mark, four dusk colours over a night, and a 4x4 Bayer dither, the same matrix this site's [scenes](/writing/art-from-a-seed) use.

Deskline draws the link between the two computers the same way, as a strip of dusk dots that reach further and warm toward gold the better the link is. How good it is comes from two numbers, the route and the round trip:

```rust title="src/look.rs"
pub fn link_quality(kind: &str, ms: u32) -> f32 {
    let base = match kind {
        "LAN" => 1.0,
        "Direct" => 0.9,
        _ => 0.6,
    };
    (base - ms as f32 / 600.0).clamp(0.15, 1.0)
}
```

On the same network the meter is as full and warm as it gets. Through a relay, with a slow round trip, it never drops below 0.15, so there's always a little dusk left.

## The rest of it

- **Unattended access.** For your own computers, a password, stored as an Argon2 hash. Five wrong tries lock that caller out for five minutes, and thirty from anyone lock everyone out for a while.
- **The sign-in screen.** Installed on Windows, Deskline runs as a service that starts before anyone signs in, so the sign-in screen, the lock screen and UAC prompts can be seen and clicked.
- **Files and the clipboard.** Copy files on one computer and press Ctrl+V on the other, and they go over and paste where you are.
- **Coming back.** A dead link is noticed in about 12 seconds instead of 30. The viewer reconnects on its own and gets straight back in for 90 seconds.
- **Versions that don't match.** Unknown messages are skipped, so two computers on different versions still talk.
- **Linux and macOS.** I wrote those backends without a Linux or Mac machine to try them on. Expect rough edges there.

Deskline went from its first commit to 0.8.0 between November 17 and 19. Sightline, started on the 18th, does the screen part with no install at all: [a link you open in the browser](/writing/your-screen-as-a-link).
