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
  var reference = req.body.reference
  var referenceErr = {}
  var companyErr = {}
  var errorFlag = false
  var errorList = []
  var referenceConv = reference.toUpperCase()

  if (companyNumber.length < 8) {
    companyErr.type = 'invalid'
    companyErr.text = 'You must enter your full eight character company number'
    companyErr.flag = true
    errorFlag = true
  }
  if (companyNumber === '') {
    companyErr.type = 'invalid'
    companyErr.text = 'You must enter your full eight character company number'
    companyErr.flag = true
    errorFlag = true
  }
  if (
    referenceConv !== '00112233DEFSTATAC' &&
    referenceConv !== '00998877DEFSTATAA'
  ) {
    referenceErr.type = 'invalid'
    referenceErr.text = 'Enter your reference exactly as shown on your default statutory letter'
    referenceErr.flag = true
    errorFlag = true
  }
  if (reference === '') {
    referenceErr.type = 'blank'
    referenceErr.text = 'You must enter a default statutory reference'
    referenceErr.flag = true
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('company-number', {
      errorList: errorList,
      referenceErr: referenceErr,
      companyErr: companyErr,
      reference: reference,
      companyNumber: companyNumber
    })
  } else {
    req.session.ptf = []
    req.session.scenario = require('../app/assets/scenarios/' + companyNumber)
    res.redirect('check-company')
  }
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
