import queryString from 'query-string'

const create = async (params, credentials, diet) => {
    try {
        let response = await fetch('/api/diets/by/'+ params.userId, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
          },
          body: diet
        })
          return response.json()
        } catch(err) { 
          console.log(err)
        }
  }
  
  const list = async (signal) => {
    try {
      let response = await fetch('/api/diets/', {
        method: 'GET',
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const read = async (params, signal) => {
    try {
      let response = await fetch('/api/diets/' + params.dietId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const update = async (params, credentials, diet) => {
    try {
      let response = await fetch('/api/diets/' + params.dietId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: diet
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/diets/' + params.dietId, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const listByInstructor = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/diets/by/'+params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    } catch(err){
      console.log(err)
    }
  }

  const newDay = async (params, credentials, day) => {
    try {
      let response = await fetch('/api/diets/'+params.dietId+'/day/new', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({day:day})
      })
      return response.json()
    } catch(err){
      console.log(err)
    }
  }
  const listPublished = async (signal) => {
    try {
      let response = await fetch('/api/diets/published', {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  const listCategories = async (signal) => {
    try {
      let response = await fetch('/api/diets/categories', {
        method: 'GET',
        signal: signal
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const listSearch = async (params, signal) => {
    const query = queryString.stringify(params)
    try {
      let response = await fetch('/api/diets?'+query, {
        method: 'GET',
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
  }

  const listLatest = async (signal) => {
    try {
      let response = await fetch('/api/diets/latest', {
        method: 'GET',
        signal: signal
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  export {
    create,
    list,
    read,
    update,
    remove,
    listByInstructor,
    newDay,
    listPublished,
    listCategories,
    listSearch,
    listLatest    
  }