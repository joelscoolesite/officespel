# Hostile Workplace

A 3D office stealth-prank game that runs in the browser. It's Thursday, you've had enough: cause as much chaos as you can between 9:00 and 5:00 without your suspicion meter hitting 100%.

Open `index.html` in a browser (Chrome/Edge/Firefox) — no build step. Three.js is loaded from jsDelivr.

## Campaign

Five workdays, Monday to Friday. Each day has its own targets, a chaos goal and higher difficulty (people see further, react faster and stay suspicious longer). Clear a day to unlock the next one and earn up to 3 stars. When the targets and goal are done you can keep going or clock out early at the exit. Progress, stars and 15 achievements are saved in your browser.

## Multiplayer (co-op)

Up to 6 players in the same office. One player hosts: their game runs the boss and coworkers, and everyone else sees the same office. Pranks, the to-do list and the chaos score are shared by the team; everyone has their own suspicion meter and can get fired on their own. If the host gets fired or leaves, the shift ends for everyone.

In the game: **Multiplayer** tab → type a nickname → **Host a game** and share the 4-letter code. Friends open the same game, go to **Multiplayer**, type the code and press **Join**. The host picks the day on the Play tab and clocks in; everyone else gets the day's intro and clocks in too.

There are two ways to connect:

- **The Claude link:** share the artifact from its Share menu. Everyone needs a Claude account with access to it.
- **Your own PC on Wi-Fi (Windows):**
  1. Install Node.js (LTS) from https://nodejs.org.
  2. Download this repository (Code → Download ZIP) and unzip it.
  3. Double-click `start.bat`. It opens the game and prints a link like `http://192.168.1.23:3000`.
  4. Friends on the same Wi-Fi open that link. If it doesn't load, allow Node.js through Windows Firewall when Windows asks.

  On macOS/Linux run `node server.js` instead. Set `PORT` to use another port.

## Controls

| Key | Action |
| --- | --- |
| W A S D | Walk |
| Shift (hold) | Sprint (uses stamina) |
| C | Crouch — hide behind partitions and see sight cones. While sprinting: slide |
| Space | Jump |
| Mouse / arrow keys | Look |
| E (hold) | Prank, pick up, interact |
| Click | Throw what you're holding, or shove chairs, people and balloons |
| G | Drop what you're holding |
| F (hold) | Charge a fart, up to a MEGA fart. Tap F in mid-air to fart-jump |
| B | Burp |
| Tab | Show/hide the to-do list |
| M | Mute |
| Esc | Pause (resume, restart day, quit to menu) |

## How it works

- **Suspicion:** anyone who sees you mid-prank, sneaking, sprinting or snooping in the boss's office gets suspicious. The boss counts extra. Pretend to work at your desk to cool off.
- **28 pranks:** post-it bomb, stapler in jello, whoopee cushion, KICK ME note, a reply-all love email from the boss, scrambled keyboard, sunken chair, a printer full of clowns, unplugging the server, fake free pizza, clogged toilet, rubber ducks, smashed monitors, a 35°C heat wave, a full blackout, indoor sprinklers, a balloon-filled meeting room, an air horn on the boss's door, a glitter bomb, cat videos on the meeting TV, a beeping ceiling alarm clock, a toppled vending machine, a rubber poop on the boss's desk, sweaty socks in the air vent, the burp alphabet over the PA, a fart-loaded boss chair, toilet sounds instead of his slides, and knocking off the boss's toupee (bonus if you flush it).
- **Smarter coworkers:** they stop and stare when something is off, hear you sprint or land a jump, search the last place they saw you, and run to tell the boss when they catch you mid-prank. Their faces blink, follow you, show emotion and move when they talk. Swearing gets bleeped.
- **Chaos:** chaos earned within 6 seconds stacks into a combo multiplier (up to ×3). Office chairs roll and bounce, props fly, balloons drift and pop.
- **Rendering:** image-based reflections, bloom, a color grade with vignette, heat tint and shake aberration, and first-person arms. Set GRAPHICS to Low in Settings for slower PCs.
