const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.render('start')
})
router.get('/start', function (req, res) {
  res.render('start')
})
router.get('/sign-in', function (req, res) {
  res.render('sign-in')
})
router.post('/sign-in', function (req, res) {
  req.session.userEmail = req.body.email
  res.redirect('company-number')
})
router.get('/company-number', function (req, res) {
  res.render('company-number')
})
router.post('/company-number', function (req, res) {
  var companyNumber = req.body.companyNumber
  req.session.scenario = require('../assets/scenarios/' + companyNumber)
  req.session.ptf = []
  res.redirect('confirm-company')
})
router.get('/confirm-company', function (req, res) {
  res.render('confirm-company', {
    scenario: req.session.scenario
  })
})
module.exports = router
