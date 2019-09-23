# Netlify

This is an unofficial extension for VS Code, it allows you to observe and display build events for your site

## Features
You can see when your:

* Site is being deployed
* Site deploy was successful
* Site deploy has failed

## Settings

```json
{
  "netlify.site_id": "<site_name|api_id>"
}
```
> You need to append `.netlify.com` to your site id: **my-project.netlify.com**

The extension needs to find the `netlify.site_id` property in your workspace settings (`.vscode/settings.json`) or global settings in order to activate the extension

You can find the above details in your project settings under __Site details__

If you want to observe the build status of private Netlify projects, you would need to add a [**Personal Access Token**](https://app.netlify.com/user/settings) to the global settings 

```json
{
  "netlify.api_token": "<personal_access_token>"
}
```