require('dotenv').config()
const request = require('supertest')(process.env.Host)
const assert = require('chai').assert

const Headers = {
  APIToken: 'Bearer 123',
  XAppToken: '',
  SetCookie: '',
}

const user = {
  username: 'localuser@local.host',
  password: 'qwer1234',
}

const profile = {
  full_name: 'Local User',
  mst_institution_id: '611b1607-7539-4d64-9990-494e76302b39',
}

const program = {
  name: 'My Program ABC 123 v1',
  mst_year_id: 'c2d349be-cdad-4648-af0c-0b100fab1acc',
  budget: 1000000000,
  quota: 10,
  total_phase: 3,
  categories: [],
}

const submission = {
  program_category_id: '',
  name: 'My Submission ABC 99',
  referal_code: 'XXX',
  proposal_url: '/files/pdficon.png',
  address: {
    location: 'Jl H Gemin',
    mst_village_id: '31276',
    phone: '0812345678910',
    zip_code: '17421',
  },
}

const apis = {
  SignIn: '/api/sign/in',
  SignUp: '/api/sign/up',
  Programs: '/api/programs',
  MstCategory: '/api/master/category',
  Submissions: '/api/submissions',
  Activities: '/api/activities',
}

const Fetched = {
  program: {},
  submission: {},
  activity: {},
}

const LoginFunc = () =>
  request.post(apis.SignIn).set({ Authorization: Headers.APIToken }).send(user)

const RegisterFunc = () =>
  request
    .post(apis.SignUp)
    .set({ Authorization: Headers.APIToken })
    .send({ ...user, profile })

const GetMstCategoryFunc = () =>
  request
    .get(`${apis.MstCategory}?page=1&size=1`)
    .set({ Authorization: `Bearer ${Headers.XAppToken}` })
    .set('Cookie', [Headers.SetCookie])
    .send()

const GetAllProgramsFunc = () =>
  request
    .get(`${apis.Programs}?page=1&size=1&withCategory=true`)
    .set({ Authorization: `Bearer ${Headers.XAppToken}` })
    .set('Cookie', [Headers.SetCookie])
    .send()

const CreateProgramFunc = () =>
  request
    .post(apis.Programs)
    .set({ Authorization: `Bearer ${Headers.XAppToken}` })
    .set('Cookie', [Headers.SetCookie])
    .send(program)

const GetAllSubmissionsFunc = () =>
  request
    .get(`${apis.Submissions}?page=1&size=1`)
    .set({ Authorization: `Bearer ${Headers.XAppToken}` })
    .set('Cookie', [Headers.SetCookie])
    .send()

const CreateSubmissionFunc = () =>
  request
    .post(apis.Submissions)
    .set({ Authorization: `Bearer ${Headers.XAppToken}` })
    .set('Cookie', [Headers.SetCookie])
    .send(submission)

const SetActionSubmissionFunc = (submissionId, actionPayload) =>
  request
    .post(`${apis.Submissions}/${submissionId}/action`)
    .set({ Authorization: `Bearer ${Headers.XAppToken}` })
    .set('Cookie', [Headers.SetCookie])
    .expect(200)
    .send(actionPayload)

const AllocatePhaseFunc = (submissionId) =>
  request
    .post(`${apis.Submissions}/${submissionId}/allocate-phase`)
    .set({ Authorization: `Bearer ${Headers.XAppToken}` })
    .set('Cookie', [Headers.SetCookie])
    .send({ phase_number: 1 })

const GetAllActivitiesFunc = () =>
  request
    .get(`${apis.Activities}?page=1&size=1`)
    .set({ Authorization: `Bearer ${Headers.XAppToken}` })
    .set('Cookie', [Headers.SetCookie])
    .send()

const SetActionActivityFunc = (activityId, actionPayload) =>
  request
    .post(`${apis.Activities}/${activityId}/action`)
    .set({ Authorization: `Bearer ${Headers.XAppToken}` })
    .set('Cookie', [Headers.SetCookie])
    .send(actionPayload)

describe('Automate Test', async () => {
  before(async () => {
    try {
      const serviceRunning = await request.get('/health').expect(200).send()

      if (serviceRunning && serviceRunning.statusCode !== 200) {
        assert.fail('please turn on the service')
      }
    } catch (error) {
      assert.fail(
        `${error} --- Please Check if Service is running in right Host !!!`
      )
    }
  })

  after(() => {
    console.log(JSON.stringify(Fetched, null, 2))
  })

  it('Register User if Not Exists', async () => {
    // test login
    const registered = {}
    const loggedIn = await LoginFunc()

    if (loggedIn.statusCode !== 200) {
      // if not 200 then register
      const registering = await RegisterFunc()

      if (registering.statusCode === 200) {
        Object.assign(registered, await LoginFunc())
      }
    } else {
      Object.assign(registered, loggedIn)
    }

    Headers.XAppToken = registered.headers['x-app-token']
    Headers.SetCookie = registered.headers['set-cookie'][0]
  })

  it('Get All Programs', async () => {
    const allPrograms = await GetAllProgramsFunc()

    if (allPrograms.statusCode === 200) {
      const { data, meta } = allPrograms.body

      if (meta && meta.total === 0) {
        const mstCategory = await GetMstCategoryFunc()

        if (mstCategory.statusCode === 200) {
          program.categories.push(mstCategory.data[0].id)
        }

        const created = await CreateProgramFunc()

        if (created.statusCode === 200 && created.body.data) {
          Fetched.program = created.body.data
        } else {
          assert.fail(JSON.stringify(created.body))
        }
      }

      if (meta && meta.total > 0) {
        Fetched.program = data[0]
      }
    }
  })

  it('Create Submission', async () => {
    const submissionData = await GetAllSubmissionsFunc()

    if (submissionData.statusCode === 200) {
      const { data, meta } = submissionData.body

      if (meta && meta.total === 0) {
        const programCategoryId =
          Fetched.program.program_categories[0].ProgramCategory.id
        submission.program_category_id = programCategoryId

        const created = await CreateSubmissionFunc()

        if (created.statusCode === 200 && created.body.data) {
          Fetched.submission = created.body.data
        } else {
          assert.fail(JSON.stringify(created.body))
        }
      }

      if (meta && meta.total > 0) {
        Fetched.submission = data[0]
      }
    }
  })

  it('Set Submission Action', async () => {
    const submissionId = Fetched.submission.id

    await SetActionSubmissionFunc(submissionId, {
      code: 'PENGAJUAN_VERIFIKASI_SETUJU',
      payload: {
        message: 'Verifikasi Disetujui',
      },
    })

    await SetActionSubmissionFunc(submissionId, {
      code: 'PENGAJUAN_IDENTIFIKASI_SETUJU',
      payload: {
        message: 'Identifikasi Disetujui',
      },
    })
  })

  it('Allocate Phase', async () => {
    const submissionId = Fetched.submission.id
    const activity = await AllocatePhaseFunc(submissionId)

    if (activity.statusCode !== 200) {
      console.log(JSON.stringify(activity.body))

      const getActivity = await GetAllActivitiesFunc()

      if (getActivity.statusCode === 200) {
        Fetched.activity = getActivity.body.data[0]
      }
    } else {
      Fetched.activity = activity.body.data
    }
  })

  it('Set Activity Action', async () => {
    const activityId = Fetched.activity.id

    // REKENING_DIBUAT
    // PENCETAKAN_SPM
    // PEMBAYARAN_KPPN
    // PROSES_TTD_MOU
    // TTD_MOU_PIC
    // TTD_MOU_DITJEN
    // PELAKSANAAN_KEGIATAN

    await SetActionActivityFunc(activityId, {
      code: 'PENETAPAN_SK_LOKASI',
      payload: {
        message: 'OK',
      },
    })

    await SetActionActivityFunc(activityId, {
      code: 'SK_LOKASI_TERBIT',
      payload: {
        message: 'OK',
      },
    })

    await SetActionActivityFunc(activityId, {
      code: 'PEMBUATAN_REKENING',
      payload: {
        message: 'OK',
      },
    })
  })
})
