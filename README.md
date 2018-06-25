# LocationBasedGame

## Webseiten
------
### Zugriff auf Live
Die Live-Webseite ist unter https://quiz.hochschule-stralsund.de erreichbar.

### Zugriff auf Test
Die Testwebseite ist unter http://test.quiz.hochschule-stralsund.de erreichbar. Für den Zugriff werden Benutzername und Passwort benötigt. 
Diese sind die selben wie für den Zugriff auf die Virtuelle Maschine (Siehe Wiki).

## Git Konfiguration
------
### Ignoriere bestimmte Dateien / Ordner
Da nicht alle Dateien und Ordner, die beim Programmieren entstanden sind, gepusht werden müssen, können in einer `.gitignore` Datei (im Wurzelverzeichnis der Applikation) Ausnahmen definiert werden.

```bash
# Das Beispiel zeigt, wie alle Dateien und Ordner, die mit einem Punkt beginnen, von Git ignoriert werden.
.*
```

## Werkzeuge / Software

### Swagger
Swagger kann über folgende Seiten genutzt werden:
```bash
# Lokaler Aufruf wenn NodeJS läuft
http://localhost:3000/admin/swagger
# Aufruf über Live-Webseite
https://quiz.hochschule-stralsund.de/admin/swagger
# Aufruf über Testwebseite
http://test.quiz.hochschule-stralsund.de/admin/swagger
```

Um andere Routen beim Aufruf der Swagger-Seite einzubinden, kann die `swagger.json` bearbeitet werden, die sich im Wurzelverzeichnis der Applikation befindet.

### MongoDB
Das genutzte MongoDB paket kommt von `https://www.npmjs.com/package/mongodb`.
Standardwerte für die MongoDB können in der Datei `mongo.js` bearbeitet werden.
Es is ebenfalls möglich im Wurzelverzeichnis eine mongod.conf mit entsprechenden Werten anzulegen.

`Bitte beachten:` 
* Sollte sich der Name der defaultDb ändern oder eine andere Datenbank verwendet werden, so muss der Name im Dockerfile und in der mongod.conf angepasst werden.

## Notes
Beim Benutzen von npm (Version > 3) sollte darauf geachtet werden, dass der `legacy-bundling` Schalter übergeben wird

```bash
npm install --legacy-bundling PAKETNAME
```