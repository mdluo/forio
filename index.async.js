const axios = require('axios')
const qs = require('qs')
const { JSDOM } = require('jsdom')

const apiRoot = 'https://forio.com/simulate'

function getCookies(email, password) {
  return axios.post(`${apiRoot}/api/authentication/mit/video-game`, qs.stringify({
    user_action: 'login',
    email,
    password
  })).then(res => ({
    data: res.headers['set-cookie'].join('; ')
  })).catch(err => ({ err }))
}

function setData(cookie, { price, game, number }) {
  return axios.request({
    url: `${apiRoot}/api/run/mit/video-game?skip_redirect=true`,
    method: 'post',
    data: qs.stringify({
      'D_Price for Game[F1]': price,
      'D_Game Input of Royalty to Producer from Complementors[F1]': game,
      'D_Number of Complements to Subsidize[F1]': number,
    }),
    headers:{
      Cookie: cookie
    },
  }).then(res => ({
    data: res.data,
  })).catch(err => ({ err }))
}

function getStep(cookie) {
  return axios.request({
    url: `${apiRoot}/mit/video-game/simulation/include/data/step.txt?status_code=201&message=Simulation+actions+were+successfully+applied+to+simulation+Platform+Wars%3A+Simulating+the+Battle+for+Video+Game+Supremacy.`,
    headers:{
      Cookie: cookie
    },
  }).then(res => ({
    data: res.data,
  })).catch(err => ({ err }))
}

function action(cookie) {
  return axios.request({
    url: `${apiRoot}/api/run/mit/video-game?&skip_redirect=true`,
    method: 'post',
    data: {
      run_set: 'saved:true'
    },
    headers:{
      Cookie: cookie
    },
  }).then(res => ({
    data: res.data,
  })).catch(err => ({ err }))
}

function getRes(cookie) {
  return axios.request({
    url: `${apiRoot}/mit/video-game/simulation/htm/dashboard.htm`,
    headers:{
      Cookie: cookie
    },
  }).then(res => {
    const dom = new JSDOM(res.data)
    return {
      data: dom.window.document.querySelector('#overview_table > tbody > tr:nth-child(10) > td:nth-child(4)').innerHTML,
    }
  }).catch(err => ({ err }))
}

async function main() {
  const { data: cookie } = await getCookies('', '')
  const await setData(cookie, { price: 200, game: 70, number: 10 })
  const stepRes = await getStep(cookie)
  console.log(stepRes.data)
  await action(cookie)
  const res = await getRes(cookie)
  console.log(res.data)
}

main()
