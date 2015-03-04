# Starter Kit

The Predix Experience Starter Kit is one of Px's meta kits and simply ties together a few key dependencies that are usually the starting point for any new project. It is a fork of inuitcss' [starter-kit](https://github.com/inuitcss/starter-kit). The Starter Kit specifically contains some Px and inuitcss default variables and mixins, as well as [Nicolas Gallagher](https://twitter.com/necolas)’s [Normalize.css](https://github.com/necolas/normalize.css) and global `box-sizing` rules.

## Dependencies

Strictly speaking, the Starter Kit is just a collection of dependencies and nothing else. There is no Sass file, just modules you can import into your project as a starting point.

## Installation

    $ bower install --save https://github.sw.ge.com/pxc/px-tables-design.git

## Usage

The modules must be imported in the following order:
    
    // Settings
    @import "../inuit-defaults/settings.defaults";

    // Tools
    @import "../px-functions-design/tools.functions";
    @import "../px-mixins-design/tools.mixins";

    // Generic
    @import "../px-normalize-design/generic.normalize";
    @import "../px-box-sizing-design/generic.box-sizing";
    
    // Base
    @import "../px-page-design/base.page";

See [px-getting-started](https://github.sw.ge.com/pxc/px-getting-started#a-note-about-relative-import-paths) for an explanation of the `../`