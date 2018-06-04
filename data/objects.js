const objects = require('../mongodb/objects');
const collections = require('../mongodb/collections');

/**
 * Hilfsfunktion, die ein Game anhand seiner Id sucht.
 * @param dbObjects Object Map
 * @param pId Id des gesuchten Games. Id ist in diesem Fall der Index innerhalb der Liste
 * @returns {*} GameObjekt an der jeweiligen Position
 */
function getGameById(dbObjects, pId) {
    return dbObjects.get(collections.GAMES)[pId];
}

module.exports = {
    example: function () {
        /**
         * Map, die eine Liste an Objekten auf ihren jeweiligen Collection-String mappt.
         * @type {Map<String, Array<any>>}
         */
        let dbObjects = new Map();


//User
        dbObjects.set(
            collections.USERS,
            [
                new objects.User("Harald")
            ]
        );


//Locations
        dbObjects.set(
            collections.LOCATIONS,
            [
                new objects.Location("110", "http://qr.service.fh-stralsund.de/h4r110"),
                new objects.Location("112", "http://qr.service.fh-stralsund.de/h4r112"),
                new objects.Location("113", "http://qr.service.fh-stralsund.de/h4r113"),
                new objects.Location("114", "http://qr.service.fh-stralsund.de/h4r114"),
                new objects.Location("115", "http://qr.service.fh-stralsund.de/h4r115"),
                new objects.Location("116", "http://qr.service.fh-stralsund.de/h4r116"),
                new objects.Location("117", "http://qr.service.fh-stralsund.de/h4r117"),
                new objects.Location("224", "http://qr.service.fh-stralsund.de/h4r224"),
                new objects.Location("225a", "http://qr.service.fh-stralsund.de/h4r225a"),
                new objects.Location("231", "http://qr.service.fh-stralsund.de/h4r231"),
                new objects.Location("320", "http://qr.service.fh-stralsund.de/h4r320"),
                new objects.Location("323", "http://qr.service.fh-stralsund.de/h4r323")
            ]
        );


//Expositions
        dbObjects.set(
            collections.EXPOSITIONS,
            [
                new objects.Exposition("Automatisierungstechnik", "<p>Die Nachbildung eines Forschungsbetriebes dient zur Einführung der Studierenden in die komplexe Welt der Automatisierungstechnik. Schwerpunkte bilden hierbei der Entwurf, die Umsetzung und die Untersuchung des Verhaltens von Automatisierungssystemen.</p><p>Weiteres Thema ist die Kommunikationstechnik im industriellen Umfeld. Hierzu werden Grundlagen und Spezialwissen im Labor praxisnah vermittelt.</p>", undefined, ["https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/0/5/csm_Header_Softwareentwicklung_0d7a471182.jpg", "https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/6/5/csm_Header_IT-Sicherheit_a349f746b3.jpg"]),

                new objects.Exposition("Regelungstechnik", "<p>Die Zweckbestimmung des Labors ist die Umsetzung der Lehrinhalte im Fach Steuerungstechnik sowie weiterführende Untersuchungen und Lehrveranstaltungen auf dem Gebiet der Automatisierungstechnik.</p><u>Versuchsaufbauten:</u><ul><li>SPS-Steuerung eines Drei-Achsen-Modells</li><li>Simulationstafel \"Stern-Dreieck-Anlasser\" mit SPS-Steuerung</li><li>Soft- und Hardwaremodelle verschiedener Systeme mit SPS-Steuerung</li><li>Experimentierplätze mit SPS Simatic S7-300</li></ul>", undefined, ["https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/0/5/csm_Header_Softwareentwicklung_0d7a471182.jpg", "https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/6/5/csm_Header_IT-Sicherheit_a349f746b3.jpg"]),

                new objects.Exposition("Steuerungstechnik", "<p>Die Zweckbestimmung des Labors ist die Umsetzung der Lehrinhalte im Fach Steuerungstechnik sowie weiterführende Untersuchungen und Lehrveranstaltungen auf dem Gebiet der Automatisierungstechnik.</p><u>Versuchsaufbauten:</u><ul><li>SPS-Steuerung eines Drei-Achsen-Modells</li><li>Simulationstafel \"Stern-Dreieck-Anlasser\" mit SPS-Steuerung</li><li>Soft- und Hardwaremodelle verschiedener Systeme mit SPS-Steuerung</li><li>Experimentierplätze mit SPS Simatic S7-300</li></ul>", undefined, ["https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/0/5/csm_Header_Softwareentwicklung_0d7a471182.jpg", "https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/6/5/csm_Header_IT-Sicherheit_a349f746b3.jpg"]),

                new objects.Exposition("Hochspannungstechnik", "<p>Im Labor Hochspannungstechnik erhalten die Studenten des Studiengangs Elektrotechnik eine Einführung in die Arbeit mit Hochspannungsanlagen und führen hochspannungstechnische Untersuchungen anhand von Gleich- und Wechselspannungen, Entladungserscheinungen im inhomogenen Feld, Erzeugung von Blitzstoß- und Schaltstoßspannungen, Prüfung von Isolatoren mit Stoßspannungen durch.</p><p><u>Das Leistungsangebot:</u><br>Das Labor Hochspannungstechnik bietet Vertragspartnern und externen Nutzern Schulungen von Fachpersonal für Hochspannungsanlagen an. Im Rahmen freier Kapazitäten können Energieversorgungsunternehmen das Labor für Qualitätsprüfungen an energietechnischen Erzeugnissen nutzen.</p><p><u>Die Ausstattung:</u><br>Das Labor Elektrische Energieversorgung ist mit hochwertiger Technik ausgerüstet, so dass das Labor neben der praktischen Ausbildung auch für die Bearbeitung von Diplomarbeitsthemen und die Durchführung von Forschungsvorhaben genutzt werden kann.</p>", undefined, ["https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/0/5/csm_Header_Softwareentwicklung_0d7a471182.jpg", "https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/6/5/csm_Header_IT-Sicherheit_a349f746b3.jpg"]),

                new objects.Exposition("Energieversorgung", "<p>Das Labor Elektrische Energieversorgung gewährleistet die praxisnahe Durchführung von Versuchsreihen für die Fächer Elektrische Energieversorgung, Anlagentechnik sowie Maschinen- und Netzschutz.</p><p>Weiterhin werden im Rahmen der Labortätigkeit die Themengebiete Planung von BHKW-Anlagen und Schutzmaßnahmen nach DIN VDE 0100 behandelt.</p><p><u>Die Ausstattung:</u><br>Das Labor Elektrische Energieversorgung ist mit hochwertiger Technik ausgerüstet, so dass das Labor neben der praktischen Ausbildung auch für die Bearbeitung von Diplomarbeitsthemen und die Durchführung von Forschungsvorhaben genutzt werden kann.</p><p><u>Das Leistungsangebot:</u><br>Das Serviceangebot des Labors für Elektrische Energieversorgung richtet sich an Energieversorgungsunternehmen und an Forschungseinrichtungen zur Kooperation. Für Stadtwerke werden Seminare zur beruflichen Weiterbildung des Fachpersonals durchgeführt. Im Auftrag von Unternehmen erarbeitet das Labor Studien, Marktanalysen, Standortstudien und Softwareentwicklungen für die Praxis.</p>", undefined, ["https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/0/5/csm_Header_Softwareentwicklung_0d7a471182.jpg", "https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/6/5/csm_Header_IT-Sicherheit_a349f746b3.jpg"]),

                new objects.Exposition("E-Antriebstechnik / Leistungselektronik", "<p><u>Leistungselektronik - Worum geht es?</u><br>Es geht um die Umwandlung elektrischer Energie mittels so genannter Leistungshalbleiter. Dabei kann die Leistungselektronik (immer nur kombiniert mit passiven Filtern!) elektrische Größen im Frequenz und Amplitude variieren.</p>", undefined, ["https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/0/5/csm_Header_Softwareentwicklung_0d7a471182.jpg", "https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/6/5/csm_Header_IT-Sicherheit_a349f746b3.jpg"]),

                new objects.Exposition("Elektrische Maschinen", "<p>Es gibt ruhende Elektrische Maschinen (Transformator) sowie auch rohtierende Elektrische Maschinen. Letztere können abhängig vom Betriebsbereich als Motor oder auch Generator verwendet werden. Jedoch erst kombiniert mit der Leistungselektronik entsteht ein elektrischer Antrieb, mit dem eine Drehzahl oder auch eine Lage bzw. ein Winkel generiert werden kann.</p>", undefined, ["https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/0/5/csm_Header_Softwareentwicklung_0d7a471182.jpg", "https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/6/5/csm_Header_IT-Sicherheit_a349f746b3.jpg"]),

                new objects.Exposition("Computergrafik / Bildverarbeitung", "<p>Im Labor Computergrafik werden algorithmische Grundkenntnisse der grafischen Datenverarbeitung und der Bildverarbeitung vertieft und der Umgang mit Entwicklungsumgebungen für grafische Anwendungen erlernt, wie z.B. OpenGL und OpenInventor.</p><p><b>Aufgaben 3D-Computergrafik</b><br><u>Geometrische Modellierung</u><br>Modellerstellung und -speicherung (Polygonnetz, parametrisierte Kurven und Flächen, Triangulierung)<br><br><u>Geometrische transformation</u><br>Modell-, Ansichts-, Projektions- und Viewport-Transformation (Translation, Skalierung, Rotation, Scherung, homogene Koordinaten, Weltkoordinaten- und Kamerakoordinatensystem) <br><br><u>Rendering</u><br>Visibilitätsalgorythmen (Backface-Culling, Z-Buffer, Painter), Shading (Flat, Phong, Gouraud), Beleuchtungsrechnung, globale Beleuchtungsverfahren (Raytracing, Radiosity), Texture-Mapping</p>", undefined, ["https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/0/5/csm_Header_Softwareentwicklung_0d7a471182.jpg", "https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/6/5/csm_Header_IT-Sicherheit_a349f746b3.jpg"]),

                new objects.Exposition("Med. Bildverarbeitung / Visualisierung", "<p>Im Labor für Medizinische Bildgebung und Visualisierung lernen die Studierenden, komplexe graphische Anwendungssysteme und Interaktionsschittstellen zu konzipieren und zu entwickeln. Das Labor verfügt über ein VR-System, dass aus einer Stereo-Rückprojektionswand inklusive zwei Beamern und einem Trackingsystem besteht. Hier können zum Beispiel neuronale Faserbahnen aus Daten der Magnetresonanztomografie dreidimensional dargestellt werden. Der Nutzer kann die dargestellte Szene interaktiv manipulieren und so zum Beispiel auswählen, welche Faserbahnen visualisiert werden sollen.</p>", undefined, ["https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/0/5/csm_Header_Softwareentwicklung_0d7a471182.jpg", "https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/6/5/csm_Header_IT-Sicherheit_a349f746b3.jpg"]),

                new objects.Exposition("Mikroprozessortechnik", "MUSS NOCH GESCHRIEBEN WERDEN", undefined),

                new objects.Exposition("Ambient Assisted Living", "<p>Im Labor für Ambient Assisted Living (AAL) lernen die Studierenden Konzepte, technische Lösungen, Anwendungen und Standards des medizinischen Tele-Monitorings und des Ambient Assisted Living kennen. Sie bewerten und konzipieren hier Anwendungen des Health-Tele-Monitorings und des AAL. Das Labor verfügt über eine Vielzahl von Geräten aus der ambulanten Pflege, dem Smarthome- und dem Tele-Monitoring-Bereich.</p>", undefined),

                new objects.Exposition("Audio- / Video-Studio", "<p>Im Audio- / Video-Studio erfolgt eine Praxisgerechte Ausbildung auf dem Gebiet der digitalen Audio- und Video-Signalverarbeitung. </p>Studierende arbeiten an Projekten zur Entwicklung von Multimedia-CD-ROMs und –DVDs, an der Produktion von Audio- und Videofiles, Internetseiten und anderen multimedialen Applikationen. </p><p>Das Audio- / Video-Studio bietet als Serviceleistung die Beratung zu Problemen der Entwicklung von multimedialen Präsentationen, speziell zu Fragen der Verwendung von Autorensystemen und Videoschnittsystemen, zu Problemen des Einsatzes von Videokonferenzsystemen und zu allgemeinen Problemen der multimedialen Kommunikation und Vernetzung.</p>", undefined)
            ]
        );


//Games
        dbObjects.set(
            collections.GAMES,
            [
                //R114
                new objects.SimpleQuiz("Was wird durch R symbolisiert?",
                    [new objects.Answer("Widerstand", true),
                        new objects.Answer("Spannung", false),
                        new objects.Answer("Stromstärke", false),
                        new objects.Answer("Leistung", false),
                        new objects.Answer("Arbeit", false)], 100),


                //R224
                new objects.SimpleQuiz("Was ist OpenGL?",
                    [new objects.Answer("Grafikstandard", true),
                        new objects.Answer("Grafik API", true),
                        new objects.Answer("Treiber", false),
                        new objects.Answer("Programmiersprache", false),
                        new objects.Answer("Grafikkartenhersteller", false)], 100),
                new objects.SimpleQuiz("Wie heisst das Computer-Bauteil, auf dem graphische Operationen ausgeführt werden?",
                    [new objects.Answer("Grafikkarte", true),
                        new objects.Answer("GPU", true),
                        new objects.Answer("Monitor", false),
                        new objects.Answer("Joystick", false),
                        new objects.Answer("MPU", false),
                        new objects.Answer("CPU", false)], 100),


                //R231
                new objects.SimpleQuiz("Was ist ein Oszilloskop?",
                    [new objects.Answer("elektronisches Messgerät", true),
                        new objects.Answer("Fernrohr", false),
                        new objects.Answer("Ventilator", false),
                        new objects.Answer("Landkarte von Osz", false)], 100),
                new objects.SimpleQuiz("Was ist ein RAM?",
                    [new objects.Answer("Schreib/Lesespeicher", true),
                        new objects.Answer("phys. Einheit", false),
                        new objects.Answer("Sternenbild", false),
                        new objects.Answer("spez. Elektr. Maschine", false)], 100),
                new objects.SimpleQuiz("Was bedeutet USB?",
                    [new objects.Answer("universelle serielle Schnittstelle", true),
                        new objects.Answer("Rechneranschluß", true),
                        new objects.Answer("Universelle Strombegrenzung", false),
                        new objects.Answer("Kabel zwischen 2 elektrischen Geräten", false),
                        new objects.Answer("mathematischer Begriff", false)], 100),
                new objects.SimpleQuiz("Was kennzeichnet ein digitales Signal?",
                    [new objects.Answer("nur Wert von 0 oder 1", true),
                        new objects.Answer("kann jeden Wert annehmen", false),
                        new objects.Answer("Signal zwischen nur 2 Teilnehmern", false),
                        new objects.Answer("Begriff in der Astronomie", false)], 100),
                new objects.SimpleQuiz("Was bedeutet Hexadezimal?",
                    [new objects.Answer("Zahlenbasis 16", true),
                        new objects.Answer("Ziffern von 0-f", true),
                        new objects.Answer("Zahlenbasis 10", false),
                        new objects.Answer("Zahlenbasis 8", false),
                        new objects.Answer("Zahlenbasis 2", false)], 100),
                new objects.SimpleQuiz("Was heißt ALU?",
                    [new objects.Answer("Arithmetik-Logik-Einheit", true),
                        new objects.Answer("allgemeine Längen-Konstante", false),
                        new objects.Answer("aktuelle Lösungs-Unbekannte", false),
                        new objects.Answer("Begriff in der Astronomie", false)], 100),


                //R320
                new objects.SimpleQuiz("Welcher Vitalparameter kann mit den im Labor vorhandenen Geräten nicht gemessen werden?",
                    [new objects.Answer("Hirnströme", true),
                        new objects.Answer("Blutdruck", false),
                        new objects.Answer("Körpertemperatur", false),
                        new objects.Answer("Blutzucker", false)], 100),

                //R323
                new objects.SimpleQuiz("Welche Auflösung hat Full-HD?",
                    [new objects.Answer("1920 × 1080", true),
                        new objects.Answer("800 x 600", false),
                        new objects.Answer("1024 x 768", false),
                        new objects.Answer("1280 x 720", false),
                        new objects.Answer("1280 x 800", false)], 100),
                new objects.SimpleQuiz("Wo wurde die MP3 erfunden?",
                    [new objects.Answer("Deutschland", true),
                        new objects.Answer("Holland", false),
                        new objects.Answer("Österreich", false),
                        new objects.Answer("Schweiz", false),
                        new objects.Answer("Russland", false),
                        new objects.Answer("USA", false),
                        new objects.Answer("Amerika", false)], 100),

                //R225a
                new objects.SimpleQuiz("Mit welchem Verfahren der medizinischen Bildgebung wurden die gezeigten Bilder aufgenommen?",
                    [new objects.Answer("MRT", true),
                        new objects.Answer("Magnetresonanztomografie", true),
                        new objects.Answer("Computertomografie", false),
                        new objects.Answer("CT", false),
                        new objects.Answer("Röntgen", false),
                        new objects.Answer("Ultraschall", false)], 100),
                new objects.SimpleQuiz("Was versteht man unter VR?",
                    [new objects.Answer("Virtuelle Realität", true),
                        new objects.Answer("Virtual Reality", true),
                        new objects.Answer("Vereinsregister", false),
                        new objects.Answer("Virenreiniger", false),
                        new objects.Answer("Vip Room", false)], 100)
            ]
        );


//LocationMapping
        dbObjects.set(
            collections.LOCATION_MAPPING,
            [
                //R114
                new objects.LocationMapping(dbObjects.get(collections.LOCATIONS)[4], dbObjects.get(collections.EXPOSITIONS)[4],
                    [
                        getGameById(dbObjects, 0)
                    ]
                ),

                //R224
                new objects.LocationMapping(dbObjects.get(collections.LOCATIONS)[7], dbObjects.get(collections.EXPOSITIONS)[7],
                    [
                        getGameById(dbObjects, 1),
                        getGameById(dbObjects, 2)
                    ]
                ),

                //R231
                new objects.LocationMapping(dbObjects.get(collections.LOCATIONS)[9], dbObjects.get(collections.EXPOSITIONS)[9],
                    [
                        getGameById(dbObjects, 3),
                        getGameById(dbObjects, 4),
                        getGameById(dbObjects, 5),
                        getGameById(dbObjects, 6),
                        getGameById(dbObjects, 7),
                        getGameById(dbObjects, 8)
                    ]
                ),

                //R320
                new objects.LocationMapping(dbObjects.get(collections.LOCATIONS)[10], dbObjects.get(collections.EXPOSITIONS)[10],
                    [
                        getGameById(dbObjects, 9)
                    ]
                ),

                //R323
                new objects.LocationMapping(dbObjects.get(collections.LOCATIONS)[11], dbObjects.get(collections.EXPOSITIONS)[11],
                    [
                        getGameById(dbObjects, 10),
                        getGameById(dbObjects, 11)
                    ]
                ),

                //R225a
                new objects.LocationMapping(dbObjects.get(collections.LOCATIONS)[8], dbObjects.get(collections.EXPOSITIONS)[8],
                    [
                        getGameById(dbObjects, 12),
                        getGameById(dbObjects, 13)
                    ]
                )
            ]
        );


//Events
        dbObjects.set(
            collections.EVENTS,
            [
                new objects.Event("Campus Tag 2018", String(new Date().toJSON().slice(0, 10)), [
                    dbObjects.get(collections.LOCATION_MAPPING)[0],
                    dbObjects.get(collections.LOCATION_MAPPING)[1],
                    dbObjects.get(collections.LOCATION_MAPPING)[2],
                    dbObjects.get(collections.LOCATION_MAPPING)[3],
                    dbObjects.get(collections.LOCATION_MAPPING)[4],
                    dbObjects.get(collections.LOCATION_MAPPING)[5]
                ])
            ]
        );
        return dbObjects;
    }
};