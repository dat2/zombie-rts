zombie-rts
==========

<a href="https://codeclimate.com/github/dat2/zombie-rts">
  <img alt="Code Climate Score" src="http://img.shields.io/codeclimate/github/dat2/zombie-rts.svg?style=flat">
</a>
<a href="https://david-dm.org/dat2/zombie-rts">
  <img alt="Dependency Status" src="http://img.shields.io/david/dat2/zombie-rts.svg?style=flat">
</a>

A JavaScript Next game. Trello board is [here](https://trello.com/b/l5yqHRK9/zombie-rts) but this is not public.
I shall eventually create a publicly readable google doc with the game design.

### Website!
There is a new [website](https://zombie-rts.herokuapp.com/) up and running for feedback now! Play the game there and leave feedback here!

NOTE: I am currently experimenting with node-webkit, so the web app may become very outdated over time.

### Setup

You must have nodejs, bower, and gulp installed for this. Clone the repository, then run `npm install && bower install` (to install dependencies) in the root directory.

NOTE: Currently the game is running on node-webkit, so you also must install node-webkit for this. You can install node-webkit by running `npm -g install nodewebkit`.

### Running the game

`gulp` will start a nodewebkit instance that updates itself (via gulp) when you change the code.
