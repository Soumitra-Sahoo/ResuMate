export const BASE_URL = 'https://resumate-jet-rho.vercel.app'

export const API_PATHS = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        GET_PROFILE: '/api/auth/profile',
    },
    RESUME: {
        CREATE: '/api/resume',
        GET_ALL: '/api/resume',
        GET_BY_ID: (id) => `/api/resume/${id}`,
        UPDATE: (id) => `/api/resume/${id}`,
        DELETE: (id) => `/api/resume/${id}`,
        UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`,
        DUPLICATE: (id) => `/api/resume/${id}/duplicate`,
        GENERATE_SHARE: (id) => `/api/resume/${id}/share`,
        REVOKE_SHARE: (id) => `/api/resume/${id}/share`,
        GET_PUBLIC: (token) => `/api/resume/view/${token}`,
    },
    AI: {
    IMPROVE_BULLET: '/api/ai/improve-bullet',
    IMPROVE_SUMMARY: '/api/ai/improve-summary', 
    IMPROVE_PROJECT: '/api/ai/improve-project', 
    ATS_SCORE: '/api/ai/ats-score',
},
    IMAGE: {
        UPLOAD_IMAGE: '/api/auth/upload-image'
    }
}