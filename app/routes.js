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
  req.session.email = req.body.email
  res.redirect('company-number')
})
router.get('/company-number', function (req, res) {
  res.render('company-number')
})
router.post('/company-number', function (req, res) {
  var companyNumber = req.body.companyNumber
  req.session.scenario = require('../app/assets/scenarios/' + companyNumber)
  req.session.ptf = []
  res.redirect('check-company')
})
router.get('/check-company', function (req, res) {
  res.render('check-company', {
    scenario: req.session.scenario
  })
  router.get('/ptf', function (req, res) {
    res.render('ptf', {
      scenario: req.session.scenario
    })
  })
  router.post('/ptf', function (req, res) {
    var ptf = req.body.ptf

    switch (ptf) {
      case 'yes':
        res.redirect('/confirmation')
        break
      case 'no':
        res.redirect('/options')
        break
    }
  })
  router.get('/options', function (req, res) {
    res.render('options', {
      scenario: req.session.scenario
    })
  })
})
router.get('/confirmation', function (req, res) {
  var email = {}
  email = req.session.ptf.pop()
  res.render('confirmation', {
    scenario: req.session.scenario,
    email: req.session.email
  })
})
module.exports = router
