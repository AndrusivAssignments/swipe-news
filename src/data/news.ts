export type Category = "Lokal" | "Sport" | "Politik" | "Kultur" | "Wirtschaft" | "Panorama";

export interface NewsItem {
  id: string;
  category: Category;
  title: string;
  summary: string; // ~60 words
  body: string;
  image: string;
  readTime: string;
  publishedAt: string;
}

// Unsplash images - generic, news-friendly
export const NEWS: NewsItem[] = [
  {
    id: "hs-live-1",
    category: "Sport",
    title: "Triathlon-Wochenende bringt 1.500 Sportler nach Heilbronn",
    summary:
      "Heilbronn stand am Wochenende im Zeichen des Ausdauersports: Rund 1.500 Teilnehmende gingen beim VR Bank Triathlon an den Start. Für viele junge Zuschauer wurde die Strecke entlang des Neckars zum Treffpunkt. Besonders gefragt waren die Sprintdistanz, die Staffeln und die Fanzonen mit Musik, Foodtrucks und spontanen Vereinsaktionen.",
    body: "Der Triathlon füllte die Innenstadt und die Wege am Neckar über mehrere Stunden. Vereine aus der Region nutzten die Veranstaltung, um Nachwuchs für Schwimmen, Radfahren und Laufen zu gewinnen. Die Organisatoren wollen das Event im kommenden Jahr stärker mit Schulen und Hochschulen verbinden. Auch die Verkehrsführung rund um die Strecke soll nach Rückmeldungen aus der Stadt noch einmal angepasst werden.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
    readTime: "2 Min.",
    publishedAt: "15. Juni 2026, 10:20 Uhr",
  },
  {
    id: "hs-live-2",
    category: "Lokal",
    title: "Innenstadt-Check: Wo Heilbronn abends lebendiger werden soll",
    summary:
      "Mehr Licht, mehr Sitzplätze, mehr Aufenthaltsqualität: Die Stadt diskutiert neue Ideen für die Heilbronner Innenstadt am Abend. Junge Menschen wünschen sich vor allem sichere Wege, günstige Treffpunkte und Veranstaltungen ohne Konsumzwang. Erste Testflächen könnten im Sommer rund um Marktplatz, Neckarmeile und Bildungscampus starten.",
    body: "Die Vorschläge kommen aus Gesprächen mit Jugendlichen, Studierenden, Gastronomen und Anwohnern. Im Fokus stehen Orte, die nach Ladenschluss schnell leer wirken. Geplant sind mobile Sitzmöbel, kleine Kulturflächen, bessere Beleuchtung und Kooperationen mit lokalen Initiativen. Die Stadt will prüfen, welche Maßnahmen kurzfristig möglich sind und wo Lärmschutz oder Verkehr berücksichtigt werden müssen.",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=800&q=80",
    readTime: "3 Min.",
    publishedAt: "15. Juni 2026, 09:45 Uhr",
  },
  {
    id: "hs-live-3",
    category: "Wirtschaft",
    title: "Neckarsulm sucht Azubis für Technik, Pflege und Handel",
    summary:
      "Viele Betriebe in Neckarsulm und Heilbronn werben früher als sonst um Auszubildende. Besonders gefragt sind junge Leute in Technik, Pflege, Logistik und Einzelhandel. Kammern und Schulen planen deshalb neue Kurzformate: weniger Messehalle, mehr echte Einblicke in Werkstätten, Stationen und Teams vor Ort.",
    body: "Unternehmen berichten, dass klassische Anzeigen kaum noch reichen. Deshalb sollen Schnuppertage, Social-Media-Formate und kurze Bewerbungsgespräche direkt in Betrieben ausgebaut werden. Für Schülerinnen und Schüler zählt neben dem Gehalt vor allem, wie flexibel der Alltag ist und ob ein Team sympathisch wirkt. Die Region will Ausbildungsangebote sichtbarer und verständlicher machen.",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
    readTime: "3 Min.",
    publishedAt: "15. Juni 2026, 08:30 Uhr",
  },
  {
    id: "hs-live-4",
    category: "Kultur",
    title: "Hohenlohe plant mehr Open-Air-Kultur für junge Besucher",
    summary:
      "Kleine Bühnen, regionale Acts und günstige Abendtickets: In Hohenlohe sollen diesen Sommer mehr Kulturangebote junge Besucher erreichen. Geplant sind Pop-up-Konzerte, Poetry-Abende und Kino unter freiem Himmel. Veranstalter setzen auf kurze Wege, ÖPNV-Kombitickets und Formate, die auch spontan nach Schule, Ausbildung oder Uni funktionieren.",
    body: "Mehrere Kommunen prüfen gemeinsame Termine, damit sich Angebote nicht überschneiden. Die Kulturvereine wollen außerdem lokale Bands und Newcomer stärker einbinden. Ziel ist ein Programm, das nicht nur klassisches Publikum erreicht, sondern auch Jugendliche, Studierende und junge Familien. Erste Termine sollen über Instagram, WhatsApp-Kanäle und die lokalen Veranstaltungskalender verbreitet werden.",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
    readTime: "2 Min.",
    publishedAt: "15. Juni 2026, 07:55 Uhr",
  },
  {
    id: "hs-live-5",
    category: "Politik",
    title: "Kraichgau-Kommunen testen Jugendbudget für eigene Projekte",
    summary:
      "Mehrere Kraichgau-Kommunen wollen Jugendlichen ein eigenes Budget für lokale Projekte geben. Finanziert werden könnten Sitzplätze, Sportflächen, Workshops oder kleine Events. Entscheiden sollen junge Menschen selbst in digitalen Abstimmungen. Die Rathäuser hoffen, dadurch mehr Beteiligung zu schaffen als bei klassischen Sitzungen am Abend.",
    body: "Das Modell sieht vor, dass Gruppen ab 14 Jahren Ideen einreichen können. Nach einer kurzen Prüfung durch die Verwaltung stimmen Jugendliche online über die besten Vorschläge ab. Wichtig ist, dass Projekte schnell sichtbar werden und nicht in langen Verfahren verschwinden. Schulen, Jugendhäuser und Vereine sollen helfen, die Abstimmungen bekannt zu machen.",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80",
    readTime: "3 Min.",
    publishedAt: "15. Juni 2026, 07:20 Uhr",
  },
  {
    id: "1",
    category: "Lokal",
    title: "Neue Neckaruferpromenade öffnet im Sommer",
    summary:
      "Heilbronn bekommt im Juli eine neu gestaltete Neckaruferpromenade mit Sitzstufen, Pop-up-Cafés und einem Skatepark. Die Stadt investiert 12 Millionen Euro, um das Ufer für junge Menschen attraktiver zu machen. Geplant sind außerdem Open-Air-Konzerte und ein wöchentlicher Streetfood-Markt jeden Freitagabend ab 17 Uhr direkt am Wasser.",
    body: "Die Bauarbeiten an der neuen Neckaruferpromenade liegen im Zeitplan. Oberbürgermeister Harry Mergel kündigte an, dass das Areal Anfang Juli eröffnet wird. Highlights sind eine 200 Meter lange Sitztreppe, ein Skatepark mit Bowl-Element sowie wechselnde Pop-up-Gastronomie. Der Streetfood-Markt soll jeden Freitag bis Oktober stattfinden. Junge Heilbronner können sich mit Konzepten für Stände bewerben.",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
    readTime: "3 Min.",
    publishedAt: "vor 2 Stunden",
  },
  {
    id: "2",
    category: "Sport",
    title: "Heilbronner Falken vor entscheidendem Playoff-Spiel",
    summary:
      "Die Heilbronner Falken stehen heute Abend vor dem wichtigsten Spiel der Saison. Bei einem Sieg in Bietigheim ziehen die Eishockeyspieler ins Halbfinale der DEL2 ein. Trainer Stephan Mair setzt auf die junge Sturmreihe. Über 4.000 Fans werden in der Halle erwartet - Tickets sind seit Tagen ausverkauft.",
    body: "Spielbeginn ist um 19:30 Uhr in der EgeTrans Arena. Die Falken liegen in der Best-of-Five-Serie mit 2:1 vorne. Captain Frederik Cabana sagte: 'Wir sind heiß auf das Halbfinale.' Live-Übertragung gibt es bei SpradeTV. Im Falle eines Sieges plant der Verein eine Public-Viewing-Aktion am Heilbronner Marktplatz.",
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=800&q=80",
    readTime: "2 Min.",
    publishedAt: "vor 4 Stunden",
  },
  {
    id: "3",
    category: "Kultur",
    title: "Neues Festival auf der Theresienwiese geplant",
    summary:
      "Im August startet auf der Theresienwiese das erste 'Neckar Beats'-Festival mit Acts wie Apache 207, Nina Chuba und lokalen Newcomern. Drei Tage, vier Bühnen, 25.000 Besucher pro Tag erwartet. Tickets ab 49 Euro. Die Veranstalter versprechen ein nachhaltiges Konzept mit Mehrwegbechern und Shuttle-Bussen aus dem ganzen Stadt- und Landkreis.",
    body: "Das Line-up wurde gestern offiziell bestätigt. Headliner am Freitag ist Apache 207, am Samstag Nina Chuba, am Sonntag ein internationaler Act, der noch geheim gehalten wird. Lokale Künstler wie Levin Liam und Esther Graf sind ebenfalls dabei. Der Vorverkauf startet morgen um 10 Uhr.",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
    readTime: "4 Min.",
    publishedAt: "vor 6 Stunden",
  },
  {
    id: "4",
    category: "Politik",
    title: "Gemeinderat beschließt kostenlosen ÖPNV für Schüler",
    summary:
      "Ab dem neuen Schuljahr fahren alle Heilbronner Schüler kostenlos mit Bus und Stadtbahn. Der Gemeinderat stimmte gestern mit großer Mehrheit für das Modell. Die Stadt rechnet mit Kosten von rund 8 Millionen Euro pro Jahr, die aus dem Klimafonds finanziert werden sollen. Auch Auszubildende profitieren vom neuen Ticket.",
    body: "Das 'Bildungsticket Heilbronn' gilt rund um die Uhr im gesamten HNV-Verbundgebiet. Eltern müssen das Ticket einmal jährlich online beantragen. Kritik kam von der FDP, die das Modell als 'sozial unausgewogen' bezeichnete. Befürworter sehen es als wichtigen Schritt gegen Verkehrsstaus und für mehr Klimaschutz im Stadtkreis.",
    image:
      "https://images.unsplash.com/photo-1556122071-e404eaedb77f?auto=format&fit=crop&w=800&q=80",
    readTime: "3 Min.",
    publishedAt: "vor 8 Stunden",
  },
  {
    id: "5",
    category: "Panorama",
    title: "TikTok-Star aus Heilbronn knackt 5-Millionen-Marke",
    summary:
      "Die 19-jährige Lina Weber aus Sontheim hat als erste Heilbronnerin die Marke von fünf Millionen TikTok-Followern geknackt. Ihre Comedy-Videos über das Alltagsleben in Heilbronn gehen regelmäßig viral. Marken wie Zalando und Adidas haben bereits Kooperationen angefragt. Lina studiert nebenbei BWL an der Hochschule Heilbronn.",
    body: "Lina Webers Erfolg begann während der Pandemie mit kurzen Sketchen über schwäbische Eigenheiten. Heute lebt sie von ihren Einnahmen und beschäftigt zwei Mitarbeiter. 'Ich will Heilbronn cool machen', sagt sie. Demnächst startet ihr eigener Podcast 'Käthchen Talk' bei Spotify mit prominenten Gästen aus der Region.",
    image:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
    readTime: "2 Min.",
    publishedAt: "vor 12 Stunden",
  },
  {
    id: "6",
    category: "Wirtschaft",
    title: "Audi-Werk Neckarsulm baut 800 neue E-Auto-Jobs auf",
    summary:
      "Audi investiert eine Milliarde Euro in den Standort Neckarsulm und schafft 800 neue Stellen in der E-Mobilität. Ab 2027 läuft hier der neue elektrische A8 vom Band. Für die Region bedeutet das einen massiven Wirtschaftsschub. Gesucht werden vor allem Softwareentwickler, Batteriespezialisten und Mechatroniker mit Ausbildung oder Studium.",
    body: "Werksleiter Fred Schulze sprach von der 'größten Investition seit 20 Jahren'. Der neue A8 e-tron wird komplett in Neckarsulm gefertigt. Parallel entsteht ein neues Trainingszentrum für die Umschulung bestehender Mitarbeiter. Die IG Metall begrüßte die Pläne, fordert aber Tarifsicherheit auch für die neuen Arbeitsplätze.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
    readTime: "4 Min.",
    publishedAt: "vor 1 Tag",
  },
  {
    id: "7",
    category: "Lokal",
    title: "Käthchenhaus wird zum interaktiven Museum",
    summary:
      "Das historische Käthchenhaus in der Innenstadt wird ab Herbst zum interaktiven Museum mit VR-Erlebnis. Besucher können die Heilbronner Geschichte mittels Augmented Reality erleben - von Kleists Drama bis zur Stadtzerstörung 1944. Der Eintritt für unter 25-Jährige ist frei. Erwartet werden über 100.000 Besucher im ersten Jahr.",
    body: "Das Konzept stammt vom Berliner Studio 'Phase 7'. Highlights sind eine VR-Tour durch das mittelalterliche Heilbronn und ein interaktives Theaterstück, bei dem Besucher Käthchens Entscheidungen treffen. Die Eröffnung ist für den 9. November geplant - dem Jahrestag der Zerstörung Heilbronns im Zweiten Weltkrieg.",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
    readTime: "3 Min.",
    publishedAt: "vor 1 Tag",
  },
  {
    id: "8",
    category: "Sport",
    title: "Heilbronner Marathon mit Rekordanmeldung",
    summary:
      "Beim Trollinger-Marathon im Mai gehen erstmals über 10.000 Läufer an den Start. Die Strecke führt durch die Weinberge rund um Heilbronn. Neu ist eine 5-Kilometer-Strecke speziell für Schüler und Studenten zum Einstiegspreis von 10 Euro. Der Startschuss fällt am 4. Mai um 9 Uhr auf dem Marktplatz.",
    body: "Veranstalter Markus Frank freut sich: 'Wir sind seit drei Jahren ausgebucht, aber so viele wie diesmal hatten wir noch nie.' Die Anmeldung läuft noch bis 20. April. Entlang der Strecke werden 25 Musik-Acts spielen, am Ziel gibt es einen Trollinger-Schoppen für jeden Finisher.",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
    readTime: "2 Min.",
    publishedAt: "vor 1 Tag",
  },
];
