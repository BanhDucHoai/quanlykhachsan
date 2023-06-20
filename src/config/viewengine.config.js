const express = require('express');
const path = require('path');
/**
 * Config view engine for app
 */
const configViewEngine = (app)=> {
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.static(path.join(__dirname, '../')));
    app.set("view engine", "ejs");
    app.set("views",path.join(__dirname, '../views'));
    app.set('layout', '../Views/layout.ejs')
    app.set('layoutstaff','../Views/layoutstaff.ejs')
};

module.exports = configViewEngine;
