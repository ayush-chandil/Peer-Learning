const { addIssue } = require('../../controllers/Student/addIssue')

const addIssueRouter = require('express').Router()

addIssueRouter.post('/', addIssue)

module.exports = addIssueRouter
