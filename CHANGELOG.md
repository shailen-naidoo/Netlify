# ChangeLog

### 1.6.3 | 2025-08-12

* Fixed an issue pertaining to not being able to set the API token if none was set before.

### 1.6.2 | 2025-08-02

* Updated the readme to reflect the introduction of the `Netlify: Set Netlify API Token` command.
* Cleaned up the readme

### 1.6.1 | 2025-08-02

* Updated the logo, made it better

### 1.6.0 | 2025-08-02

* Migrated Netlify API Token storage to SecretStorage API
* Updated the logo to the current Netlify logo

### 1.5.0 | 2020-12-31

* Turning off Netlify sidebar functionality for now due to Netlify removing deploy summary information from the API

### 1.1.0 | 2020-12-13

* Deploys API is now paginated so the extension is not as data heavy

#### Contributions 🎉

* [Esteban Pastorino](https://github.com/kitop)

### 1.0.0 | 2020-04-13

* You can now set the colors of the Netlify build status via the `settings.json` file, makes it a bit easier for users that have different themes

### 0.9.0 | 2020-04-11

#### New features 🎉

* Added a command `View deploy log` to view the current branches deploy log (build process) on Netlify

### 0.8.0 | 2020-03-21

#### New features 🎉

* Added a Netlify Explorer to the Sidebar where you can view you build summary for now

### 0.7.0 | 2020-02-11

#### New features 🎉

* Added the ability to trigger a Netlify build proccess calling the provided build hook

### 0.6.5 | 2020-01-29

* Added a link to Patreon for those who would like to support the project 

### 0.6.4 | 2020-01-22

* Adjusts tp some of the colors used for better contrasting

#### Contributions 🎉

* [Martin Wheeler](https://github.com/martinwheeler)

### 0.6.3 | 2019-11-13

* Using new `vscode.ThemeColor` API

### 0.6.2 | 2019-11-13

* Removed `vscode.themeColor` as default color

### 0.6.1 | 2019-10-02

* You can now add an API Token for Workspace settings

### 0.6.0 | 2019-10-02

* If `Fetching deploy status` fails, you will now get a status bar message

### 0.5.2 | 2019-09-30

* Changed `View latest deploy` button to `View latest Netlify deploy`

### 0.5.1 | 2019-09-29

* `View latest deploy` now goes to current deploy of your branch
* If no deploy is available for your current branch it will say `No deploy for current branch`

### 0.2.6 | 2019-09-29

* Added `View latest deploy` button to statusbar for quick access to recent deploys
* Added Netlify commands to command pallette
  - `View latest deploy`
  - `View production site`
