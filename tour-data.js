/* ---------------------------------------------------------------
   Altstadt-Runde — all tour content lives here.
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
      talkMin: 5,
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
      flag: { type: `time`, text: `If the Glockenspiel is about to play, stop talking and let it. It runs 12–15 min and it is the single best thing on the square.` }
    },

    {
      num: 2,
      name: `Platzl`,
      sub: `Hofbräuhaus · FC Bayern Store, 60 m apart`,
      talkMin: 4,
      maps: `Hofbräuhaus München`,
      core: [
        `<b>The Hofbräuhaus exists because a duke thought beer was too expensive.</b> In 1589 Wilhelm V was irritated that his court imported brown ale from Einbeck, 600 km north. So he built his own brewery. <i>Hofbräu</i> = court brew.`,
        `<b>And that's where Bock beer comes from.</b> "Einbeck" became Bavarian dialect <i>ainpöckisch</i>, then just <i>Bock</i> — which also means billy goat, which is why there is a goat on the label.`,
        `<b>It was royal-only for 240 years.</b> Ludwig I opened it to the public in 1828. It seats about 3,000 today.`,
        `<b>Regulars keep their own steins here</b> in padlocked wire lockers along the walls. The waiting list runs decades.`,
        `<b>Across the square: the FC Bayern store.</b> The club is 75% owned by its own members — about 400,000 of them. Adidas, Audi and Allianz hold roughly 8% each. Nobody can buy it.`
      ],
      extra: [
        `<b>Honest note, if the group is the kind that wants it:</b> the Nazi party proclaimed its 25-point programme in the Festsaal upstairs on 24 February 1920. Munich does not hide this, and neither should the tour.`,
        `<b>Lenin drank here.</b> He lived in Munich from 1900 to 1902, editing <i>Iskra</i>, and was a regular. Mozart lived two streets away in 1781.`,
        `<b>FC Bayern was also founded by a breakaway.</b> In 1900 members of a gymnastics club walked out because the club refused to let them join the German football association. 30+ league titles later.`,
        `The band plays <i>In München steht ein Hofbräuhaus</i> roughly every 40 minutes. The song is from 1935 and the tourists sing along without knowing a word.`
      ],
      flag: { type: `warn`, text: `The store is a genuine time sink. If anyone goes in, you lose 5 minutes and the buffer with it.` }
    },

    {
      num: 3,
      name: `Max-Joseph-Platz`,
      sub: `Residenz · Nationaltheater`,
      talkMin: 3,
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
      num: 4,
      name: `Odeonsplatz`,
      sub: `Feldherrnhalle · Theatinerkirche · Viscardigasse`,
      talkMin: 4,
      maps: `Feldherrnhalle, München`,
      core: [
        `<b>This is a copy of a Florentine loggia.</b> Ludwig I built the Feldherrnhalle in 1841 after the Loggia dei Lanzi. He wanted Munich to be "Athens on the Isar" and spent a fortune making it look like somewhere warmer.`,
        `<b>Hitler's 1923 putsch died on these steps.</b> The march from the Bürgerbräukeller was stopped by state police right here. Sixteen marchers and four policemen were killed. He fled, was jailed, and wrote <i>Mein Kampf</i> in the cell.`,
        `<b>Then the Nazis turned it into a shrine</b> with an SS honour guard, and anyone walking past had to give the Hitler salute.`,
        `<b>So Munich walked around it.</b> The little alley behind me — Viscardigasse — was the detour people took to avoid saluting. It got the nickname <i>Drückebergergasse</i>, shirkers' alley. There is now a line of bronze cobblestones set into the pavement tracing their path.`
      ],
      extra: [
        `<b>The yellow church with the green domes</b> is the Theatinerkirche, built to thank God for an heir after ten childless years of marriage. First Italian High Baroque church north of the Alps, and that particular yellow is now a Munich colour.`,
        `<b>The two generals</b> in the loggia are Tilly, from the Thirty Years' War, and Wrede, from the Napoleonic wars. Wrede fought for Napoleon, then against him, and got a statue either way.`,
        `<b>Look north up Ludwigstraße.</b> Ludwig I drove it straight as a ruler for 1.2 km to the Siegestor. Nothing in the Altstadt is allowed to rise above 100 m — that rule is why the skyline still looks like this.`
      ],
      flag: { type: `tip`, text: `Viscardigasse is 30 seconds away and the bronze stones are the best photograph on the tour. Worth the detour if you are on time.` }
    },

    {
      num: 5,
      name: `Café Luitpold`,
      sub: `Brienner Straße 11`,
      talkMin: 2,
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
      flag: { type: `warn`, text: `Going inside costs 10+ minutes. Recommend it as the place to come back to after the tour instead.` }
    },

    {
      num: 6,
      name: `Frauenkirche`,
      sub: `Munich's cathedral · the two domes`,
      talkMin: 2,
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
      flag: { type: `tip`, text: `Entry is free and takes 3 min. Check for a service first. If you are behind schedule, tell the footstep story outside — it works from the square.` }
    },

    {
      num: 7,
      name: `Marienplatz`,
      sub: `Back where you started`,
      talkMin: 1,
      maps: `Marienplatz, München`,
      core: [
        `<b>Close the loop.</b> Point back at the Glockenspiel. One hour ago they didn't know it beats Lorraine every single time.`,
        `<b>Closing line, if you want one:</b> this city was founded by moving someone else's bridge, and it has been quietly rerouting traffic in its own favour ever since.`
      ],
      extra: [
        `Hand off to food: Viktualienmarkt is two minutes south, Schneider Bräuhaus three minutes east, Café Luitpold nine minutes back north if they want somewhere quiet.`
      ],
      flag: null
    }
  ],

  /* Six walks. steps[] are Google Maps' own turn-by-turn instructions,
     translated. talk[] is what to say while moving. */
  legs: [
    {
      min: 6, googleMin: 5, meters: 400,
      via: `Sparkassenstraße`,
      from: `Marienplatz, München`, to: `Hofbräuhaus München`,
      steps: [
        `Head east across the square toward <b>Dienerstraße</b> — 29 m`,
        `Slight right toward <b>Sparkassenstraße</b> — 94 m`,
        `Left onto <b>Sparkassenstraße</b> — 170 m`,
        `Right onto <b>Münzstraße</b> — 77 m`,
        `Left onto <b>Platzl</b>. Hofbräuhaus on the right — 13 m`
      ],
      talk: [
        `Dienerstraße means "servants' street" — this is where the court's staff lived and shopped.`,
        `On Münzstraße you pass the old Mint. It started life as the duke's stables with his art collection on the floor above, which tells you how Renaissance princes ranked their priorities.`
      ]
    },
    {
      min: 6, googleMin: 5, meters: 350,
      via: `Pfisterstraße & Hofgraben`,
      from: `Hofbräuhaus München`, to: `Max-Joseph-Platz, München`,
      steps: [
        `Head toward <b>Pfisterstraße</b> — 47 m`,
        `Left onto <b>Pfisterstraße</b> — 140 m`,
        `Right onto <b>Hofgraben</b> — 75 m`,
        `Left onto <b>Maximilianstraße</b>. Square on the right — 71 m`
      ],
      talk: [
        `Hofgraben — "court moat". You are walking the line of the medieval city ditch.`,
        `Maximilianstraße, when you hit it, is Munich's luxury mile. Built in the 1850s by Maximilian II, who invented his own architectural style for it and named it after himself.`
      ]
    },
    {
      min: 5, googleMin: 4, meters: 300,
      via: `Residenzstraße`,
      from: `Max-Joseph-Platz, München`, to: `Feldherrnhalle, München`,
      steps: [
        `Head toward <b>Residenzstraße</b> — 35 m`,
        `Right onto <b>Residenzstraße</b> — 240 m`,
        `Turn left. Feldherrnhalle on the left — 24 m`
      ],
      talk: [
        `The bronze lions are on your right about halfway up. Let them rub the noses — it's the one bit of the Residenz you can touch.`,
        `Watch for a narrow alley on the left just before the end: that's Viscardigasse, and it's the story at the next stop.`
      ]
    },
    {
      min: 6, googleMin: 5, meters: 350,
      via: `Brienner Straße`,
      from: `Feldherrnhalle, München`, to: `Cafe Luitpold, Brienner Str. 11, München`,
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
        `This is the long leg — 11 minutes. Spend it, don't rush it.`,
        `<b>Salvatorkirche</b>, the brick one: late Gothic, 1494, and since 1829 the Greek Orthodox church of Munich. Ludwig I handed it over when his son Otto became King of Greece.`,
        `<b>Kardinal-Faulhaber-Straße</b> is named for the archbishop who attacked Nazi racial theory from the pulpit in his 1933 Advent sermons. The palais on both sides are 18th century — the one at number 7 is the archbishop's residence, built by an Elector for his mistress.`,
        `<b>Löwengrube</b> means "lions' pit". There were actually lions kept here in the 16th century.`
      ]
    },
    {
      min: 5, googleMin: 4, meters: 350,
      via: `Kaufingerstraße`,
      from: `Frauenkirche, München`, to: `Marienplatz, München`,
      steps: [
        `Head toward <b>Liebfrauenstraße</b> — 28 m`,
        `Continue onto <b>Liebfrauenstraße</b> — 58 m`,
        `Left onto <b>Kaufingerstraße</b> — 170 m`,
        `Straight on into <b>Marienplatz</b> — 78 m`
      ],
      talk: [
        `Kaufingerstraße is one of the busiest shopping streets in Europe by footfall. It was pedestrianised for the 1972 Olympics — one of Germany's first.`,
        `Start wrapping up here. You want to arrive at the square with your closing line ready, not still talking about shoes.`
      ]
    }
  ]
};
