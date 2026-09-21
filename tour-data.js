/* ---------------------------------------------------------------
   Munich Oldtown Tour — all tour content lives here.
   Edit this file to change what you say. Nothing else needs touching.

   talkMin  = minutes budgeted standing still at a stop
   min      = minutes budgeted for a walk at group pace (Google + 20%)
   googleMin / meters = what Google Maps returned, for reference
   --------------------------------------------------------------- */

const TOUR = {
  totalMin: 60,

  stops: [
    {
      num: 1,
      name: `Marienplatz`,
      sub: `Neues Rathaus · Altes Rathaus · Mariensäule`,
      talkMin: 6,
      maps: `Marienplatz, München`,
      core: [
        `<b>Munich was founded by sabotage.</b> In 1158 Henry the Lion burned down the bishop's toll bridge over the Isar upstream, and built his own here. The salt road — and the toll income — moved to his town. The name comes from <i>Munichen</i>, "by the monks."`,
        `<b>The big Gothic town hall isn't Gothic.</b> The Neues Rathaus was finished in 1909. It is younger than the Brooklyn Bridge. Georg von Hauberrisser won the competition at 27 and spent the next 40 years building it.`,
        `<b>The Glockenspiel</b> — 43 bells, 32 figures, added 1908. Top half: the 1568 wedding of Duke Wilhelm V, where the Bavarian knight beats the knight from Lorraine. Every time. Bottom half: the coopers' dance, said to have started in 1517 to coax people back outdoors after a plague.`,
        `<b>The white building at the far end is the real old one.</b> The Altes Rathaus. On 9 November 1938, Goebbels gave the speech in its ballroom that set off Kristallnacht across Germany. It is a toy museum now.`
      ],
      extra: [
        `<b>The gold column</b> is the Mariensäule, 1638. Maximilian I put it up to thank the Virgin Mary that Munich and Landshut came through the Swedish occupation unburned. The four cherubs at the base are fighting war, plague, hunger and heresy.`,
        `<b>This square is kilometre zero for Bavaria.</b> Every distance to Munich is measured from the column.`,
        `<b>The city's mascot is a monk who got younger.</b> The Münchner Kindl started as an adult monk on the coat of arms and has been drawn progressively more childlike for 700 years.`,
        `Before it was a market square this was where jousts and executions happened. It has been pedestrianised only since 1972, for the Olympics.`
      ],
      flag: { type: `time`, text: `If the Glockenspiel is about to play, enjoy! It runs 12–15 min and it is the single best thing on the square.` }
    },

    {
      num: 2,
      name: `Viktualienmarkt`,
      sub: `The city's food market since 1807`,
      talkMin: 5,
      maps: `Viktualienmarkt, 80331 München`,
      core: [
        `<b>A king moved this market by decree.</b> In 1807 Max I Joseph ordered the food traders off Marienplatz because they had outgrown it. They came here and never left — about 140 stalls across 22,000 square metres.`,
        `<b>"Viktualien" is a dead word.</b> It meant foodstuffs, from the Latin, and it has fallen out of German entirely. It survives in exactly one place in the language: the name of this market.`,
        `<b>The blue and white pole</b> carries the guild figures — every trade that supplied the city. Bavarian villages still steal each other's maypoles and ransom them back for beer. That is a live custom, not a show for visitors.`,
        `<b>The beer garden in the middle rotates.</b> Munich's six big breweries each get a turn on the taps. It is the only beer garden in the city that does this, which is why you can't tell people "this is a Paulaner garden" — next month it isn't.`
      ],
      extra: [
        `<b>You may legally bring your own food into a Bavarian beer garden.</b> You just have to buy the beer there. The right is protected and taken seriously — you will see families unpacking entire picnics at the tables.`,
        `<b>The fountains honour comedians</b>, not generals. Karl Valentin above all — a surrealist double act with Liesl Karlstadt that Brecht openly admired and borrowed from.`,
        `Prices here are the highest in the city and nobody minds. It stopped being where Munich does the shopping and became where Munich buys the one good thing.`
      ],
      flag: { type: `tip`, text: `Worth two minutes of wandering, and the best spot on the route for a break.` }
    },

    {
      num: 3,
      name: `Platzl`,
      sub: `Hofbräuhaus · FC Bayern Store, 60 m apart`,
      talkMin: 6,
      maps: `Hofbräuhaus München`,
      core: [
        `<b>The Hofbräuhaus exists because a duke thought beer was too expensive.</b> In 1589 Wilhelm V was irritated that his court imported brown ale from Einbeck, 600 km north. So he built his own brewery. <i>Hofbräu</i> = court brew.`,
        `<b>And that's where Bock beer comes from.</b> "Einbeck" became Bavarian dialect <i>ainpöckisch</i>, then just <i>Bock</i> — which also means billy goat, which is why there is a goat on the label.`,
        `<b>It was royal-only for 240 years.</b> Ludwig I opened it to the public in 1828. It seats about 3,000 today.`,
        `<b>Regulars keep their own steins here</b> in padlocked wire lockers along the walls. The waiting list runs decades.`,
        `<b>Across the square: the FC Bayern store.</b> The club is 75% owned by its own members — about 400,000 of them. Adidas, Audi and Allianz hold roughly 8% each. Nobody can buy it.`
      ],
      extra: [
        `<b>The darker history, which Munich does not hide:</b> the Nazi party proclaimed its 25-point programme in the Festsaal upstairs on 24 February 1920.`,
        `<b>Lenin drank here.</b> He lived in Munich from 1900 to 1902, editing <i>Iskra</i>, and was a regular. Mozart lived two streets away in 1781.`,
        `<b>FC Bayern was also founded by a breakaway.</b> In 1900 members of a gymnastics club walked out because the club refused to let them join the German football association. 30+ league titles later.`,
        `The band plays <i>In München steht ein Hofbräuhaus</i> roughly every 40 minutes. The song is from 1935 and the tourists sing along without knowing a word.`
      ],
      flag: null
    },

    {
      num: 4,
      name: `Alter Hof`,
      sub: `The first Wittelsbach residence · the Monkey Tower`,
      talkMin: 5,
      maps: `Alter Hof 1, 80331 München`,
      core: [
        `<b>This courtyard is where Munich's rulers actually started.</b> Built around 1253 as the first Wittelsbach residence in the city, when Munich became a ducal seat. The Residenz you'll see later is what they moved on to.`,
        `<b>For a stretch of the 14th century this was the centre of the Holy Roman Empire.</b> Ludwig the Bavarian ruled from these buildings after his coronation. His tomb is in the Frauenkirche, the last stop on this route.`,
        `<b>The bay tower in the corner is the Affenturm — the Monkey Tower.</b> The story goes that a court monkey took the infant Ludwig out of his cradle, carried him up onto the roof, and the whole household stood frozen in this courtyard until it climbed back down and handed him over. That baby became emperor.`,
        `<b>They outgrew it and left in the 15th century.</b> It became the tax and administration office, which is a quiet joke about what happens to every grand headquarters eventually.`
      ],
      extra: [
        `Flattened in the war and rebuilt slowly. The glass wing on one side is deliberately modern rather than a fake reconstruction — Munich still argues about that choice.`,
        `<b>The real reason to come in here:</b> it is free, always open, and almost always empty. Sixty seconds off Marienplatz and the noise stops dead. That contrast is the whole reason to step in.`
      ],
      flag: null
    },

    {
      num: 5,
      name: `Dallmayr`,
      sub: `Dienerstraße 14 · purveyor to the royal court`,
      talkMin: 3,
      maps: `Dallmayr, Dienerstraße 14, 80331 München`,
      core: [
        `<b>There has been a delicatessen on this spot since the early 1700s</b> — older than the United States. Alois Dallmayr bought it in 1870 and gave it the name that stuck, even though his family didn't run it for long afterwards.`,
        `<b>Purveyor to the Bavarian royal court</b>, and to a string of other European courts besides. The warrant is still on the building.`,
        `<b>The coffee is the thing.</b> Dallmayr Prodomo sits in half the kitchens in Germany, and it is roasted by this company. The ground-floor hall is worth stepping into for the smell alone.`,
        `<b>The blue and white vases</b> along the walls are Nymphenburg porcelain, from the royal manufactory. Same house that made the tableware for the kings.`
      ],
      extra: [
        `There is a live crayfish tank in the fish department, which visitors find either charming or grim.`,
        `This is the shop that never stopped serving the same families — some of the accounts here go back to the monarchy.`
      ],
      flag: null
    },

    {
      num: 6,
      name: `Max-Joseph-Platz`,
      sub: `Residenz · Nationaltheater`,
      talkMin: 4,
      maps: `Max-Joseph-Platz, München`,
      core: [
        `<b>One family ran Bavaria for 738 years.</b> The Wittelsbachs, 1180 to 1918. Longer than the Romanovs, longer than the Tudors. This was their town house.`,
        `<b>It started as a small castle and ate the neighbourhood.</b> Ten courtyards, 130 rooms open to the public — one of the largest city palaces in Europe.`,
        `<b>The opera house is where Wagner happened.</b> <i>Tristan und Isolde</i>, <i>Die Meistersinger</i>, <i>Das Rheingold</i> and <i>Die Walküre</i> all premiered on that stage, paid for by Ludwig II.`,
        `<b>The king in the middle</b> is Maximilian I Joseph. Napoleon made him Bavaria's first king in 1806 in exchange for troops. Bavaria was a kingdom for only 112 years.`
      ],
      extra: [
        `<b>Rub the lions.</b> Back on Residenzstraße there are bronze lions holding shields, polished gold on the nose and the shield by a few centuries of hands. Locals still do it for luck. Good photo, costs nothing.`,
        `The theatre burned down in 1823 and was bombed flat in 1943. Both times Munich rebuilt it exactly as it was, rather than modernising. That instinct explains most of what you're looking at on this tour.`,
        `You just walked up <b>Hofgraben</b> — "court moat". The street follows the line of the medieval city ditch.`
      ],
      flag: null
    },

    {
      num: 7,
      name: `Feldherrnhalle`,
      sub: `Odeonsplatz · Theatinerkirche · Viscardigasse`,
      talkMin: 6,
      maps: `Feldherrnhalle, Residenzstraße 1, 80333 München`,
      core: [
        `<b>This is a copy of a Florentine loggia.</b> Ludwig I built the Feldherrnhalle in 1841 after the Loggia dei Lanzi. He wanted Munich to be "Athens on the Isar" and spent a fortune making it look like somewhere warmer.`,
        `<b>Hitler's 1923 putsch died on these steps.</b> The march from the Bürgerbräukeller was stopped by state police right here. Sixteen marchers and four policemen were killed. He fled, was jailed, and wrote <i>Mein Kampf</i> in the cell.`,
        `<b>Then the Nazis turned it into a shrine</b> with an SS honour guard, and anyone walking past had to give the Hitler salute.`,
        `<b>So Munich walked around it.</b> The little alley just behind the loggia — Viscardigasse — was the detour people took to avoid saluting. It got the nickname <i>Drückebergergasse</i>, shirkers' alley. There is now a line of bronze cobblestones set into the pavement tracing their path.`
      ],
      extra: [
        `<b>The yellow church with the green domes</b> is the Theatinerkirche, built to thank God for an heir after ten childless years of marriage. First Italian High Baroque church north of the Alps, and that particular yellow is now a Munich colour.`,
        `<b>The two generals</b> in the loggia are Tilly, from the Thirty Years' War, and Wrede, from the Napoleonic wars. Wrede fought for Napoleon, then against him, and got a statue either way.`,
        `<b>Look north up Ludwigstraße.</b> Ludwig I drove it straight as a ruler for 1.2 km to the Siegestor. Nothing in the Altstadt is allowed to rise above 100 m — that rule is why the skyline still looks like this.`
      ],
      flag: { type: `tip`, text: `Viscardigasse is 30 seconds away, and the bronze stones set into the pavement are the best photograph on the route.` }
    },

    {
      num: 8,
      name: `Café Luitpold`,
      sub: `Brienner Straße 11`,
      talkMin: 3,
      maps: `Cafe Luitpold, Brienner Str. 11, München`,
      core: [
        `<b>Opened 1888</b>, named for Prince Regent Luitpold, who ran Bavaria for 26 years after Ludwig II was declared insane and drowned in a lake under circumstances nobody has satisfactorily explained.`,
        `<b>At its peak it was the largest café on the continent</b> — marble halls, a palm court, winter gardens, billiard rooms, concert rooms. This is where Munich's artists argued, in the years Kandinsky and Klee were inventing abstract painting a few streets north.`,
        `<b>Bombed flat in 1944.</b> A fragment survived, the café limped on, and the current version reopened in 2010. The Luitpoldtorte has been on the menu since the 1880s.`
      ],
      extra: [
        `<b>Brienner Straße was Munich's first grand boulevard</b>, laid out in 1812 and named after a battle against Napoleon. Number 45, a few hundred metres up, was the Brown House — Nazi party headquarters. The NS-Dokumentationszentrum stands on the site today.`,
        `The Prinzregentenzeit, Luitpold's reign, is remembered as Munich's golden age — which tells you something, given that it was the reign of a regent standing in for a king everyone agreed was mad.`
      ],
      flag: null
    },

    {
      num: 9,
      name: `Frauenkirche`,
      sub: `Munich's cathedral · the two domes`,
      talkMin: 4,
      maps: `Frauenkirche, München`,
      core: [
        `<b>Built in 20 years, 1468 to 1488.</b> Cologne cathedral took 632. This one went up in two decades because the city was in a hurry and had the money.`,
        `<b>It's brick, not stone.</b> There is no good building stone anywhere near Munich, so they used what they had. That's why it looks so plain from outside.`,
        `<b>The onion domes were an accident.</b> They were meant to be Gothic spires. The money ran out, they capped the towers with Renaissance domes as a stopgap in 1525, and the stopgap became the symbol of the city.`,
        `<b>99 metres tall — and that is now the legal ceiling.</b> Munich voted in a referendum in 2004 that nothing in the centre may rise above these towers.`
      ],
      extra: [
        `<b>The Devil's Footstep.</b> Just inside the door there's a black footprint in the floor. The legend says the devil funded the church on condition it had no windows; standing on that exact tile, the pillars line up and hide every window. He laughed, stepped forward, saw he'd been had, and stamped. The trick genuinely works — that's why the story survived.`,
        `<b>It holds about 20,000 people standing</b>, which was more than the entire population of Munich when it was built.`,
        `Inside is the tomb of Ludwig the Bavarian, the only Wittelsbach who made it to Holy Roman Emperor.`
      ],
      flag: { type: `tip`, text: `Entry is free and takes about 3 minutes, unless a service is on. The footstep story works just as well from the square outside.` }
    },

    {
      num: 10,
      name: `Marienplatz`,
      sub: `Back where you started`,
      talkMin: 1,
      maps: `Marienplatz, München`,
      core: [
        `<b>Back where you started.</b> Ninety minutes ago that Glockenspiel was just a clock on a town hall. Now you know the Bavarian knight beats Lorraine every single time.`,
        `<b>And the shape of the whole thing:</b> this city was founded by moving someone else's bridge, and it has been quietly rerouting traffic in its own favour ever since.`
      ],
      extra: [
        `Food and a sit down: Viktualienmarkt is two minutes south, Schneider Bräuhaus three minutes east, Café Luitpold nine minutes back north for somewhere quiet and grand.`
      ],
      flag: null
    }
  ],

  /* Nine walks. steps[] are Google Maps' own turn-by-turn instructions,
     translated. talk[] is what to say while moving.
     dest is the exact destination string the "Navigate" button hands to the
     Google Maps app, which routes from wherever you are actually standing. */
  legs: [
    {
      min: 4, googleMin: 3, meters: 260,
      via: `Marienplatz & Viktualienmarkt`,
      from: `Marienplatz, München`, to: `Viktualienmarkt, München`,
      dest: `Viktualienmarkt, München`,
      steps: [
        `Leave the square at the east end, past the <b>Altes Rathaus</b> — 110 m`,
        `Right onto <b>Viktualienmarkt</b> — 96 m`,
        `Left, then right again, and you are in the market — 52 m`
      ],
      talk: [
        `You are heading for the market that a king had to move off the square you were just standing on.`
      ]
    },
    {
      min: 7, googleMin: 6, meters: 450,
      via: `Sparkassenstraße`,
      from: `Viktualienmarkt, München`, to: `Hofbräuhaus München`,
      dest: `Hofbräuhaus München`,
      steps: [
        `Head north-east through the market — 15 m`,
        `Left, then right to stay on <b>Viktualienmarkt</b> — 147 m`,
        `Left onto <b>Sparkassenstraße</b> — 180 m`,
        `Right onto <b>Münzstraße</b> — 77 m`,
        `Left onto <b>Platzl</b>. Hofbräuhaus on the right — 13 m`
      ],
      talk: [
        `On Münzstraße you pass the old Mint. It started life as the duke's stables with his art collection on the floor above, which tells you how Renaissance princes ranked their priorities.`,
        `You will come back through this street in about twenty minutes on the way to the Alter Hof. Not lost — the route is a loop.`
      ]
    },
    {
      min: 3, googleMin: 2, meters: 160,
      via: `Münzstraße`,
      from: `Hofbräuhaus München`, to: `Alter Hof 1, München`,
      dest: `Alter Hof 1, München`,
      steps: [
        `Head toward <b>Bräuhausstraße</b> — 13 m`,
        `Right onto <b>Münzstraße</b> — 77 m`,
        `Right onto <b>Sparkassenstraße</b> — 6 m`,
        `Left toward <b>Alter Hof</b> — a short flight of steps — 52 m`,
        `Right, in through the gate to the courtyard — 13 m`
      ],
      talk: [
        `Two minutes, and you are walking into the place the whole city grew out of — which almost nobody standing on Marienplatz knows is there.`
      ]
    },
    {
      min: 3, googleMin: 2, meters: 130,
      via: `Alter Hof`,
      from: `Alter Hof 1, München`, to: `Dienerstraße 14, 80331 München`,
      dest: `Dienerstraße 14, 80331 München`,
      steps: [
        `Head north-east across the courtyard — 24 m`,
        `Left toward <b>Dienerstraße</b> — 85 m`,
        `Left onto <b>Dienerstraße</b>. Dallmayr on the right — 22 m`
      ],
      talk: [
        `Dienerstraße means "servants' street" — this is where the court's staff lived and shopped. Which is exactly what Dallmayr was: the shop that supplied the palace.`
      ]
    },
    {
      min: 3, googleMin: 2, meters: 170,
      via: `Dienerstraße & Residenzstraße`,
      from: `Dienerstraße 14, 80331 München`, to: `Max-Joseph-Platz, München`,
      dest: `Max-Joseph-Platz, München`,
      steps: [
        `Head north toward <b>Hofgraben</b> — 51 m`,
        `Continue onto <b>Residenzstraße</b> — 81 m`,
        `Right onto <b>Maximilianstraße</b> and the square opens up — 35 m`
      ],
      talk: [
        `You are walking the route the court took between the shop and the palace, which is the whole logic of this quarter: everything within two minutes of the king.`
      ]
    },
    {
      min: 5, googleMin: 4, meters: 300,
      via: `Residenzstraße`,
      from: `Max-Joseph-Platz, München`, to: `Feldherrnhalle, München`,
      dest: `Feldherrnhalle, München`,
      steps: [
        `Head toward <b>Residenzstraße</b> — 35 m`,
        `Right onto <b>Residenzstraße</b> — 240 m`,
        `Turn left. Feldherrnhalle on the left — 24 m`
      ],
      talk: [
        `The bronze lions are on your right about halfway up. Rub a nose — it is the one bit of the Residenz you are allowed to touch.`,
        `Watch for a narrow alley on the left just before the end: that is Viscardigasse, and it is the story at the next stop.`
      ]
    },
    {
      min: 6, googleMin: 5, meters: 350,
      via: `Brienner Straße`,
      from: `Feldherrnhalle, München`, to: `Cafe Luitpold, Brienner Str. 11, München`,
      dest: `Cafe Luitpold, Brienner Str. 11, München`,
      steps: [
        `Head along <b>Residenzstraße</b> — 24 m`,
        `Left onto <b>Residenzstraße</b> — 87 m`,
        `Left toward <b>Brienner Straße</b> — 44 m`,
        `Slight left onto <b>Brienner Straße</b>. Café on the left — 180 m`
      ],
      talk: [
        `Odeonsplatz opens north into the Hofgarten — worth a glance right as you cross.`,
        `Brienner Straße: first of Ludwig I's boulevards, 1812. In the 1930s this whole street was the Nazi government quarter.`
      ]
    },
    {
      min: 11, googleMin: 9, meters: 700,
      via: `Salvatorplatz & Kardinal-Faulhaber-Straße`,
      from: `Cafe Luitpold, Brienner Str. 11, München`, to: `Frauenkirche, München`,
      dest: `Frauenkirche, München`,
      steps: [
        `Head toward <b>Amiraplatz</b> — 21 m`,
        `Right onto <b>Amiraplatz</b> — 86 m`,
        `Continue onto <b>Salvatorplatz</b> — 99 m`,
        `Continue onto <b>Kardinal-Faulhaber-Straße</b> — 200 m`,
        `Left onto <b>Maffeistraße</b> — 61 m`,
        `Right onto <b>Windenmacherstraße</b> — 72 m`,
        `Right onto <b>Löwengrube</b> — 54 m`,
        `Left onto <b>Frauenplatz</b>, then follow it round — 90 m`
      ],
      talk: [
        `The long leg — eleven minutes, through the quietest streets on the route. No rush.`,
        `<b>Salvatorkirche</b>, the brick one: late Gothic, 1494, and since 1829 the Greek Orthodox church of Munich. Ludwig I handed it over when his son Otto became King of Greece.`,
        `<b>Kardinal-Faulhaber-Straße</b> is named for the archbishop who attacked Nazi racial theory from the pulpit in his 1933 Advent sermons. The palais on both sides are 18th century — the one at number 7 is the archbishop's residence, built by an Elector for his mistress.`,
        `<b>Löwengrube</b> means "lions' pit". There were actually lions kept here in the 16th century.`
      ]
    },
    {
      min: 5, googleMin: 4, meters: 350,
      via: `Kaufingerstraße`,
      from: `Frauenkirche, München`, to: `Marienplatz, München`,
      dest: `Marienplatz, München`,
      steps: [
        `Head toward <b>Liebfrauenstraße</b> — 28 m`,
        `Continue onto <b>Liebfrauenstraße</b> — 58 m`,
        `Left onto <b>Kaufingerstraße</b> — 170 m`,
        `Straight on into <b>Marienplatz</b> — 78 m`
      ],
      talk: [
        `Kaufingerstraße is one of the busiest shopping streets in Europe by footfall. It was pedestrianised for the 1972 Olympics — one of Germany's first.`,
        `Almost back. Marienplatz opens up at the end of this street, and the loop closes where it began.`
      ]
    }
  ]
};
