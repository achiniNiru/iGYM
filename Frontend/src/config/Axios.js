import axios from 'axios';
import { BACKEND_URL } from './data';

const Axios = axios.create({
    baseURL: BACKEND_URL,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
});


async function AxiosGet(route,token){
  const req = await Axios.get(route, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return req;
}

async function AxiosPost(route,token,data,...params){
  let headers = {
    'Authorization': `Bearer ${token}`
  }
  if(params?.formData){
    headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }
  const req = await Axios.post(route,data,{
    headers:headers
  });
  return req;
}

async function AxiosDelete(route,token,data){
  const req = await Axios.delete(route,{
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data
  });
  return req;
}

async function AxiosPut(route,token,data,...params){
  let headers = {
    'Authorization': `Bearer ${token}`
  }
  if(params?.formData){
    headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }
  const req = await Axios.put(route,data,{
    headers:headers
  });
  return req;
}

async function AxiosPatch(route,token,data,...params){
  let headers = {
    'Authorization': `Bearer ${token}`
  }
  if(params?.formData){
    headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }
  const req = await Axios.patch(route,data,{
    headers:headers
  });
  return req;
}

export default Axios;
export { AxiosGet, AxiosPost, AxiosDelete, AxiosPut, AxiosPatch }
