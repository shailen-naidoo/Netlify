# Netlify

This is an unofficial extension for VS Code, it allows you to observe and display build events for your site

![](https://i.ibb.co/dDTT78R/Screenshot-from-2019-09-23-18-27-29.png)

## Features
You can see when your:

* Site is being deployed
* Site deploy was successful
* Site is waiting to be built
* Site deploy has failed

## Settings

```json
{
  "netlify.site_id": "<site_name|api_id>",
  "netlify.api_token": "<personal_access_token>"
  "netlify.set_interval: "<number>"
}
```

* **`netlify.site_id`**: The name of your site or api id can be used, you can find these details under **Site detail**. If you site name is `my-site` then you need to append `.netlify.com` so it will be `my-site.netlify.com`

* **`netlify.api_token`**: The `api_token` is your *Personal Access Token* which can be found in *User Settings*, this will be used to authenticate private Netlify projects

* **`netlify.set_interval`**: The default is 10000ms but you can set whatever polling interval you would like.
