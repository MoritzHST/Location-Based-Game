
# LocationBasedGame

## Git configuration

### Get HS-LBG-2018 Git Project via commandline / git-bash
1. mkdir HS-LBG-2018 (optional: only if you haven't already a project folder)
3. cd HS-LBG-2018 (or the name of your project folder)
4. git init
5. git remote add origin https://gitlab.fh-stralsund.de/HS-Location-Based-Game-2018/HS-LBG-2018.git
6. git pull origin master

### Ignore specific Files/Folders
There is no need to push everything from your local repo to gitlab. To ignore specific files and folder create a file named ".gitignore" and put into your project folder.
Add the following line to the .gitignore file:

` # ignore all files and folders starting with a dot
.* `

## Usage



## Developing



### Tools

### Swagger
To edit the data displayed by swagger, use the swagger.json file in the root dir. The current demo example is based on: https://github.com/GenFirst/swagger-to-existing-nodejs-project/blob/master/backend/swagger.json

you can view swagger at:
http://localhost:3000/admin/swagger

### MongoDB
https://www.npmjs.com/package/mongodb

## Notes
if you're using npm Version >3, use "npm install" with "--legacy-bundling" option
npm install --legacy-bundling