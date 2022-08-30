import heic2any from 'heic2any'

export const socials = [
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'facebook',
        type: 'social',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'twitter',
        type: 'social',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'instagram',
        type: 'social',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'youtube',
        type: 'social',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'linkedin',
        type: 'social',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'github',
        type: 'social',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'spotify',
        type: 'social',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'tiktok',
        type: 'social',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'pinterest',
        type: 'social',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'strava',
        type: 'social',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'phone',
        type: 'contact',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'email',
        type: 'contact',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'website',
        type: 'contact',
        url: '',
        user_id: ''
    },
    {
        device_link_id: null,
        is_public: true,
        name: '',
        order: 0,
        provider: 'video',
        type: 'video',
        url: '',
        user_id: ''
    },
]


export function getLogoForSocialMedia(socialMedia) {

    let imageSrc = ''
    switch(socialMedia) {
        case 'facebook':
            imageSrc = '/assets/social-icons/facebook.png'
            break
        case 'twitter':
            imageSrc = '/assets/social-icons/twitter.png'
            break
        case 'instagram':
            imageSrc = '/assets/social-icons/instagram.png'
            break
        case 'youtube':
            imageSrc = '/assets/social-icons/youtube.png'
            break
        case 'linkedin':
            imageSrc = '/assets/social-icons/linkedin.png'
            break
        case 'github':
            imageSrc = '/assets/social-icons/github.png'
            break
        case 'spotify':
            imageSrc = '/assets/social-icons/spotify.png'
            break
        case 'tiktok':
            imageSrc = '/assets/social-icons/tiktok.png'
            break
        case 'pinterest':
            imageSrc = '/assets/social-icons/pinterest.png'
            break
        case 'strava':
            imageSrc = '/assets/social-icons/strava.png'
            break
        case 'phone':
            imageSrc = '/assets/social-icons/phone.png'
            break
        case 'email':
            imageSrc = '/assets/social-icons/email.png'
            break
        case 'website':
            imageSrc = '/assets/social-icons/website.png'
            break
        case 'video':
            imageSrc = '/assets/social-icons/video.png'
            break
        default:
            imageSrc = ''
            break
    }    

    return imageSrc
}


export function getLinkForSocialMedia(type, provider, url) {
    let link = ''
    let socialPrefix = ''

    switch(provider) {
        case 'facebook':
            socialPrefix = 'https://www.facebook.com/'
            break
        case 'twitter':
            socialPrefix = 'https://www.twitter.com/'
            break
        case 'instagram':
            socialPrefix = 'https://www.instagram.com/'
            break
        case 'youtube':
            socialPrefix = 'https://www.youtube.com/'
            break
        case 'linkedin':
            socialPrefix = 'https://www.linkedin.com/'
            break
        case 'github':
            socialPrefix = 'https://github.com/'
            break
        case 'spotify':
            socialPrefix = 'https://www.spotify.com/'
            break
        case 'tiktok':
            socialPrefix = 'https://www.tiktok.com/'
            break
        case 'pinterest':
            socialPrefix = 'https://www.pinterest.com/'
            break
        case 'strava':
            socialPrefix = 'https://www.strava.com/'
            break
        default:
            socialPrefix = ''
            break
        //TODO: add more social media providers
    }


   if(type == 'social') {
    if(url.includes('http') || url.includes('https')) {
        link = url
    }else {
        link = `${socialPrefix}${url}`
    }
   }
  
   if(type == 'contact') {

        if(provider == 'email') {
                link = `mailto:${url}`
        }else if(provider == 'phone') {
                link = `tel:${url}`
        }else if(provider == 'website') {
                if(url.includes('http') || url.includes('https')) {
                    link = url
                }else {
                    link = `https://${url}`
                }
        }
   }

   if(type == 'video') {
        link = url
   }

   return link
}



export function compressImage(imageData) {
    
    return new Promise((resolve, reject) => {

        if(imageData.type.toLowerCase() == 'image/heic') {
            heic2any({
                blob: imageData,
                toType: 'image/jpeg',
                quality: 0.5
            }).then(newImage => {
                let file = new File([newImage], 'avatar.jpg', {type: 'image/jpeg'})
                resolve(file)
            })
        }

        var reader = new FileReader();
        reader.onload = function(readerEvent) {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()
            img.onload = () => {
                const width = img.width
                const height = img.height
                canvas.width = width
                canvas.height = height
                ctx.drawImage(img, 0, 0, width, height)
                const data = canvas.toDataURL('image/jpeg', 0.5)
                fetch(data).then(res => res.blob()).then(blob => {
                    // console.log(blob);
                    let file = new File([blob], 'avatar.jpg', {type: 'image/jpeg'})
                    resolve(file)
                })
            }
            img.src = readerEvent.target.result
        }
        reader.readAsDataURL(imageData)
    })
}


export const sanitizeVideo = (url) => {
    if(!url && !url.length ) return ''
    url = url.split('&')[0]
    var sanitizedUrl = ''
    if(url.includes('vimeo') && !url.includes('player')) {
        let link = url.split('https://vimeo.com/')[1]
        sanitizedUrl = `https:/player.vimeo.com/video/${link}`
    } else if (url.includes('youtu') && !url.includes('embed')) {
        if(url.includes('watch')) {
            let link = url.split('youtube.com/watch?v=')[1]
            link = link.split('&')[0]
            sanitizedUrl = `https://www.youtube.com/embed/${link}`
         } else {
             let link = url.split('https://youtu.be/')[1]
             sanitizedUrl = `https://www.youtube.com/embed/${link}`
         }
    } else {
        sanitizedUrl = ''
    }

    return sanitizedUrl
}