// code away!

const express = require('express');

const server = require('./server');

const port = 8080;

server.listen(port, () => console.log(`\n** Server running on port ${port}`));
