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
  var companyErr = {}
  var errorFlag = false
  var errorList = []

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
  if (errorFlag === true) {
    res.render('company-number', {
      errorList: errorList,
      companyErr: companyErr,
      companyNumber: companyNumber
    })
  } else {
    req.session.ptf = []
    req.session.scenario = require('../app/assets/scenarios/' + companyNumber)
    res.redirect('check-company')
  }
})
router.get('/how-to-authenticate', function (req, res) {
  res.render('how-to-authenticate', {
    scenario: req.session.scenario
  })
})
router.post('/how-to-authenticate', function (req, res) {
  var howToAuthenticate = req.body.howToAuthenticate
  var errorFlag = false
  var errorList = []
  var reference = req.body.reference
  var referenceErr = {}
  var scenario = req.session.scenario

  switch (howToAuthenticate) {
    case 'authCode':
      res.redirect('/authenticate')
      break
    case 'reference':

      if (
        reference !== '00112233DEFSTATAC' &&
        reference !== '00998877DEFSTATAA' &&
        reference !== '00246666DEFSTATAA'
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
        res.render('reference', {
          errorList: errorList,
          referenceErr: referenceErr,
          reference: reference,
          scenario: req.session.scenario
        })
        if (scenario.company.persistentlyLate === 'yes') {
          res.redirect('/persistently-late')
        } else {
          res.redirect('/continue-trading')
          break
        }
      }
  }
})
router.get('/reference-number', function (req, res) {
  res.render('reference-number', {
    scenario: req.session.scenario
  })
})
router.post('/reference-number', function (req, res) {
  var errorFlag = false
  var errorList = []
  var reference = req.body.reference
  var referenceErr = {}
  var referenceConv = reference.toUpperCase()

  if (
    referenceConv !== '00112233DEFSTATAC' &&
    referenceConv !== '00998877DEFSTATAA' &&
    referenceConv !== '00246666DEFSTATAA'
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
    res.render('reference-number', {
      errorList: errorList,
      referenceErr: referenceErr,
      reference: reference,
      scenario: req.session.scenario
    })
  } else {
    req.session.ptf = []
    res.redirect('continue-trading')
  }
})
router.get('/authenticate', function (req, res) {
  res.render('authenticate', {
    scenario: req.session.scenario
  })
  router.post('/authenticate', function (req, res) {
    res.redirect('continue-trading')
  })
})
router.get('/warning', function (req, res) {
  res.render('warning', {
    scenario: req.session.scenario
  })
  router.post('/warning', function (req, res) {
    res.redirect('continue-trading')
  })
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
        res.redirect('/not-required')
        break
    }
  })
  router.get('/continue-trading', function (req, res) {
    res.render('continue-trading', {
      scenario: req.session.scenario
    })
  })
  router.post('/continue-trading', function (req, res) {
    var wantCompany = req.body.wantCompany
    var scenario = req.session.scenario

    switch (wantCompany) {
      case 'yes':
        if (scenario.company.prosecution === 'yes') {
          res.redirect('/prosecution')
        } else {
          res.redirect('/still-required')
        }
        break
      case 'no':
        res.redirect('/not-required')
        break
    }
  })
  router.get('/file-now', function (req, res) {
    res.render('file-now', {
      scenario: req.session.scenario
    })
  })
  router.post('/file-now', function (req, res) {
    var fileNow = req.body.fileNow

    switch (fileNow) {
      case 'yes':
        res.redirect('/filingjourney')
        break
      case 'no':
        res.redirect('/still-required')
        break
    }
  })
  router.get('/not-required', function (req, res) {
    res.render('not-required', {
      scenario: req.session.scenario,
      email: req.session.email
    })
  })
  router.get('/prosecution', function (req, res) {
    res.render('prosecution', {
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
router.get('/still-required', function (req, res) {
  var email = {}
  email = req.session.ptf.pop()
  res.render('still-required', {
    scenario: req.session.scenario,
    email: req.session.email
  })
})
module.exports = router
