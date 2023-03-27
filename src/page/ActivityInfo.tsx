import {useEffect} from 'react'
import {ApiClient} from '../core/sdk/ApiClient'

const api = new ApiClient({
  baseUrl: 'https://www.activityinfo.org',
  headers: {
    'Access-Control-Allow-Origin': '*',
    authorization: 'Bearer f8d37e665b9a7e1d496f3b74b68cca29'
  },
})

const _fetch = (method: string, url: string, opts: RequestInit = {}) => {
  return fetch('https://www.activityinfo.org' + url, {
    method,
    mode: 'no-cors',
    credentials: 'include',
    headers: {
      'x-translation': 'en',
      'authorization': 'Bearer f8d37e665b9a7e1d496f3b74b68cca29'
      // Authorization: 'a3e219a525a78ef54ddff7ad4225381c'
    },
    ...opts,
  }).then(_ => _.json())
}
export const ActivityInfo = () => {

  useEffect(() => {
    return
    fetch('https://www.activityinfo.org/resources/update', {
      'headers': {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
        'authorization': 'a3e219a525a78ef54ddff7ad4225381c',
        'content-type': 'application/json',
        'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-translation': 'en'
      },
      'referrer': 'https://www.activityinfo.org/',
      'referrerPolicy': 'strict-origin',
      'body': '{"changes":[{"formId":"cas3n26ldsu5aea5","recordId":"c9whq5slfm7bj0l2","parentRecordId":null,"fields":{"ci607odlbs8w4pe2":"cr4xx3dlbs86w9y2:cv9umq8lehiq43f103","cu3do47ldu8x1eg4m":"cqnfuewldtzuhuf2:crsa7psleo7l08n4","cva2znrle7pd83vd":"cg7v61llbunvy9t9:c247whblebrkckc6","cb7h23tle7pdocme":"cjy8nbnlbunzcnh1h:csq4sprlecp1fu1n","cqai21ple7pe0bif":"c700rjplbuo1fjq5m:cq8epmplebsu1w5c0"}},{"formId":"cy3vehlldsu5aeb6","recordId":"cbz4jqklfm7ug8g3","parentRecordId":"c9whq5slfm7bj0l2","fields":{"cmxllh3ldsuvom9g":"2023-02","c19j8p9ldsv4qa3o":"cqjd0o4ld4hbyo12:co8y3rvld4hchx14","c79be77ldswj831t":"c3vbxtgldsw1as42:cwefhkle4efhhpa","ceij8s2lbs8mvnx3f":200000,"cpbkputlbs8mvny3h":0,"cmyfyd8lbs8mvny3l":0,"cpkkgqulbs8mvny3j":0,"cgwjgg2ldsx1nzsv":200000,"cj41459lbs8mvny3n":200000}},{"formId":"cy3vehlldsu5aeb6","recordId":"cwbn2zxlfm7zayp4","parentRecordId":"c9whq5slfm7bj0l2","fields":{"cmxllh3ldsuvom9g":"2023-02","c19j8p9ldsv4qa3o":"cqjd0o4ld4hbyo12:co8y3rvld4hchx14","c79be77ldswj831t":"c3vbxtgldsw1as42:c9n7ovzle4efhhp5","cn37fnmlbs8mvny3r":12}}]}',
      'method': 'POST',
      'mode': 'cors',
      'credentials': 'include'
    })
    fetch('https://www.activityinfo.org/resources/databases', {
      'headers': {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
        'authorization': 'a3e219a525a78ef54ddff7ad4225381c',
        'content-type': 'application/json',
        'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-translation': 'en'
      },
      'referrer': 'https://www.activityinfo.org/',
      'referrerPolicy': 'strict-origin',
      'method': 'GET',
      'mode': 'cors',
      'credentials': 'include'
    })
  }, [])
  return (
    <div>
      <button onClick={() => {
        api.get(`/resources/databases`).then(console.log).catch(console.error)
      }}>
        GET
      </button>
      <button onClick={() => {
        api.post(`/resources/update`, {
          body: {
            changes: [
              {
                'formId': 'cas3n26ldsu5aea5',
                'recordId': 'c9whq5slfm7bj0l2',
                'parentRecordId': null,
                'fields': {
                  'ci607odlbs8w4pe2': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103',
                  'cu3do47ldu8x1eg4m': 'cqnfuewldtzuhuf2:crsa7psleo7l08n4',
                  'cva2znrle7pd83vd': 'cg7v61llbunvy9t9:c247whblebrkckc6',
                  'cb7h23tle7pdocme': 'cjy8nbnlbunzcnh1h:csq4sprlecp1fu1n',
                  'cqai21ple7pe0bif': 'c700rjplbuo1fjq5m:cq8epmplebsu1w5c0'
                }
              },
              {
                'formId': 'cy3vehlldsu5aeb6',
                'recordId': 'cbz4jqklfm7ug8g3',
                'parentRecordId': 'c9whq5slfm7bj0l2',
                'fields': {
                  'cmxllh3ldsuvom9g': '2023-02',
                  'c19j8p9ldsv4qa3o': 'cqjd0o4ld4hbyo12:co8y3rvld4hchx14',
                  'c79be77ldswj831t': 'c3vbxtgldsw1as42:cwefhkle4efhhpa',
                  'ceij8s2lbs8mvnx3f': 200000,
                  'cpbkputlbs8mvny3h': 0,
                  'cmyfyd8lbs8mvny3l': 0,
                  'cpkkgqulbs8mvny3j': 0,
                  'cgwjgg2ldsx1nzsv': 200000,
                  'cj41459lbs8mvny3n': 200000
                }
              },
              {
                'formId': 'cy3vehlldsu5aeb6',
                'recordId': 'cwbn2zxlfm7zayp4',
                'parentRecordId': 'c9whq5slfm7bj0l2',
                'fields': {
                  'cmxllh3ldsuvom9g': '2023-02',
                  'c19j8p9ldsv4qa3o': 'cqjd0o4ld4hbyo12:co8y3rvld4hchx14',
                  'c79be77ldswj831t': 'c3vbxtgldsw1as42:c9n7ovzle4efhhp5',
                  'cn37fnmlbs8mvny3r': 12
                }
              }
            ]
          }
        }).then(console.log).catch(console.error)
      }
      }>POSt
      </button>
      Test
    </div>
  )
}
