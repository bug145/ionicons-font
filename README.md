# Ionicons Font Package

This package allows you to use Ionicons as a custom font in your projects. Ionicons is a popular icon library, and this package makes it easy to integrate these icons as a font in your web applications.

## Features

- Convert Ionicons into a custom web font
- Easy integration using npm
- Flexible usage with multiple CSS options

## Installation

To install the package, use npm:

```bash
#for npm
npm install ionicons-font

# for yarn
yarn add ionicons-font
```
## Usage

After installing the package, you have several options for including the Ionicons CSS in your project, depending on which set of icons you want to use.

- Include All Icons:

  If you want to use all Ionicons, include the full CSS file:

  ```html
  <link rel="stylesheet" href="node_modules/ionicons-font/dist/all/ionicons.css">
  ```
- Include Basic Icons Only:

  To include only the basic Ionicons, use:

  ```html
  <link rel="stylesheet" href="node_modules/ionicons-font/dist/base/ionicons-base.css">
  ```
- Include Outline Icons Only:

  For using only outline style icons, include:

  ```html
  <link rel="stylesheet" href="node_modules/ionicons-font/dist/outline/ionicons-outline.css">
  ```
- Include Sharp Icons Only:

  To include only sharp style icons, use:

  ```html
  <link rel="stylesheet" href="node_modules/ionicons-font/dist/sharp/ionicons-sharp.css">
  ```

## How to Use

Once the CSS is included in your project, you can use Ionicons in your HTML by applying the appropriate class names. For example, to use the rocket-outline icon, you would write:
```html
<i class="ion-rocket-outline"></i>
```

For a full list of available icons and their class names, refer to the [Ionicons documentation](https://ionic.io/ionicons).