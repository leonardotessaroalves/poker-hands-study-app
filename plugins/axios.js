export default function ({ $axios, redirect }) {
    $axios.setBaseURL('http://localhost:3000/api')

    $axios.onError(error => {
      if(error.response.status === 500) {
        redirect('/sorry')
      }
    })
  }