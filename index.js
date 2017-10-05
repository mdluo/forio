const axios = require('axios')
const qs = require('qs')
const { JSDOM } = require('jsdom')

axios.post('https://forio.com/simulate/api/authentication/mit/video-game', qs.stringify({
    user_action: 'login',
    email: '',
    password: '',
  }))
  .then(function (loginRes) {
    const cookies = loginRes.headers['set-cookie'].join('; ')

    let price = 100

    for (var i = 0; i < 9; i++) {
      price += 20
    }
    //
      axios.request({
        url: 'https://forio.com/simulate/api/run/mit/video-game?skip_redirect=true',
        method: 'post',
        headers:{
          Cookie: cookies
        },
        data: qs.stringify({
          'D_Price for Game[F1]': '250',
          'D_Game Input of Royalty to Producer from Complementors[F1]': '70',
          'D_Number of Complements to Subsidize[F1]': '10',
        })
      }).then(function (gameRes) {
        // console.log(gameRes.data)

        axios.request({
          url: 'https://forio.com/simulate/mit/video-game/simulation/htm/dashboard.htm',
          headers:{
            Cookie: cookies
          }
        }).then(function (dashboardRes) {
          const dom = new JSDOM(dashboardRes.data)
          console.log(dom.window.document.querySelector('#overview_table > tbody > tr:nth-child(10) > td:nth-child(4)').innerHTML)
        })
      })


  })
  .catch(function (error) {
    console.log(error);
  });
