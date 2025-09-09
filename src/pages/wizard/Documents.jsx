import Wizard from '../../layouts/Wizard'

import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import LoadingButton from '@mui/lab/LoadingButton'
import languages from '../../data/languages.json'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';

import ClearIcon from '@mui/icons-material/Clear';

import File from '../../icons/File';
import FileImage from '../../icons/FileImage';
import FileVideo from '../../icons/FileVideo';
import FileSpreadsheet from '../../icons/FileSpreadsheet';
import FileExcel from '../../icons/FileExcel';
import FileWord from '../../icons/FileWord';
import FileLines from '../../icons/FileLines';

import LinearProgress from '@mui/material/LinearProgress';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function Documents({
  locale,
  sourceLanguage,
  targetLanguage,
  type,
  companyName,
  firstName,
  lastName,
  email,
  phone,
  country,
  additional,
  level,
  files,
  setFiles
}) {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dataLayer.push({'event': 'offerte_formulier_stap_4'});
  }, []);

  useEffect(() => {
    if (!firstName || !lastName || !email || !country) return navigate(locale === 'nl' ? '/nl/wizard/contact' : '/wizard/contact')
  })

  const onBackButtonClick = () => {
    setTimeout(() => navigate(locale === 'nl' ? '/nl/wizard/contact' : '/wizard/contact'), 250)
  }

  const onNextButtonClick = async () => {
    try {
      console.log(type);
      

      setLoading(true);

      const request = await createRequest();
      const signedUrls = await getSignedUrls(files, request.no);

      await updateRequest(request, locale, companyName, firstName, lastName, email, sourceLanguage, targetLanguage, country, phone, additional, level, signedUrls);
      await uploadFiles(files, signedUrls);
      await setPending(request.no);

      if (type === 'personal') window.location.replace(locale === 'nl' ? `https://www.scriptwaretranslations.com/nl/quote/success/private?r=${request.no}` : `https://www.scriptwaretranslations.com/quote/success/private?r=${request.no}`);
      if (type === 'business') window.location.replace(locale === 'nl' ? `https://www.scriptwaretranslations.com/nl/quote/success/business?r=${request.no}` : `https://www.scriptwaretranslations.com/quote/success/business?r=${request.no}`);
    } catch (error) {     
      navigate(locale === 'nl' ? '/nl/wizard/error' : '/wizard/error');
    }
  }
  
  const uploadFiles = async (files, signedUrls) => {
    if (files) {
      for (const [index, file] of files.entries()) {
        await uploadFile(file, signedUrls[index], index)
      }      
    }
  }

  const updateRequest = async (request, locale, companyName, firstName, lastName, emailAddress, sourceLanguage, targetLanguages, country, phoneNumber, additional, level, files) => {
    const cookies = cookieParser();    

    sourceLanguage = getLanguageCode(sourceLanguage);
    targetLanguages = targetLanguage.map(language => getLanguageCode(language));
    files = files.map(file => {
      const url = new URL(file);

      return url.origin + url.pathname;
    });
    
    const body = {
      request,
      locale,
      companyName,
      firstName,
      lastName,
      emailAddress,
      sourceLanguage,
      targetLanguages,
      country,
      phoneNumber,
      additional,
      level,
      files,
      gclid: cookies.gclid || '',
      campaign: cookies.campaign || ''
    }

    const response = await fetch('/api/update-request-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }

  const createRequest = async () => {
    const response = await fetch('/api/request');
  
    const request = await response.json();

    return request;
  }

  const uploadFile = async(file, signedUrl, index) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', signedUrl);

      xhr.upload.onprogress = (event) => {
        setFiles(files.map((file, i) => {
          if (i === index) file.progress = Math.round(event.loaded/event.total*100);

          return file;
        }))
      }

      xhr.onload = () => {
        if (xhr.status != 200) {
          console.log(xhr.status, xhr.statusText);
        } else {
          resolve();
        }
      }

      xhr.onerror = () => {
        reject('error uploading')
      }

      xhr.send(file);
    })
  }

  function getLanguageCode(name) {
    for (const language of languages) {
      if (language.nl === name || language.en === name) return language.code
    }
  }

  function cookieParser() {
    if (document.cookie.length === 0) return {};

    const cookies = {};

    document.cookie.split(';').some(item => {
      const split = item.trim().split('=');

      cookies[split[0]] = split[1];
    });

    return cookies;
  }

  const onFilesChange = (event) => {
    const selectedFiles = Array.from(event.currentTarget.files).map(file => {
      file.progress = 0;
      return file;
    });
    
    const fileNames = files.map(file => file.name);

    const filesToAdd = selectedFiles.filter(file => !fileNames.includes(file.name));

    setFiles([...files, ...filesToAdd]);

    event.currentTarget.value = '';
  }

  const deleteFile = (fileName) => {
    setTimeout(() => {
      setFiles(files.filter(file => file.name !== fileName));
    }, 250);
  }

  const getSignedUrls = async (files, requestNo) => {
    const signedUrls = []

    for (const file of files) {
      signedUrls.push(await getSignedUrl(file.name, requestNo));
    }

    return signedUrls;
  }

  const getSignedUrl = async (fileName, requestNo) => {
    const response = await fetch('/api/signed-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName, requestNo })
    });

    const body = await response.json();

    return body.url;
  }

  const setPending = async(requestNo) => {
    const options = {
      method: 'post',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({ requestNo })
    }
  
    const response = await fetch(`/api/pending`, options);
  }

  return (
    <Wizard
      locale={locale}
      title={locale === 'nl' ? 'Documenten (optioneel)' : 'Documents (optional)'}
      subtitle={locale === 'nl' ? 'Selecteer de bestanden voor vertaling' : 'Select Your Documents for Translation'}
      step={5}
      steps={5}
      nextButton={
        <LoadingButton
          loading={loading}
          onClick={onNextButtonClick}
          color="secondary"
          variant="contained"
          size="large"
        >
          {locale === 'nl' ? 'Verzenden' : 'Submit'}
        </LoadingButton>
      }
      backButton={
        <Button
          onClick={onBackButtonClick}
          color="secondary"
          variant="outlined"
          size="large"
          disabled={loading}
        >
          {locale === 'nl' ? 'Vorige' : 'Back'}
        </Button>
      }
    >
      <FormControl>
        <Button
          disabled={loading}
          component="label"
          variant="contained"
          color="secondary"
          startIcon={<CloudUploadIcon />}
        >
          {locale === 'nl' ? 'Bestanden toevoegen' : 'Add Files'}
          <VisuallyHiddenInput onChange={onFilesChange} type="file" multiple />
        </Button>
      </FormControl>

      {files.length > 0 &&
        <List
          sx={{
            marginTop: '1rem'
          }}
        >
          {files.map((file, index) => (
            <div key={index}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    sx={{opacity: loading ? 0 : 100}}
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteFile(file.name)}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  {
                    /svg|jpg|jpeg|gif|webp|png|eps($)/.test(file.name)
                    ? <FileImage />
                    : /mp4($)/.test(file.name)
                    ? <FileVideo />
                    : /xlsx|xls($)/.test(file.name)
                    ? <FileExcel />
                    : /ods|csv($)/.test(file.name)
                    ? <FileSpreadsheet />
                    : /docx|doc($)/.test(file.name)
                    ? <FileWord />
                    : /txt|odt|pdf($)/.test(file.name)
                    ? <FileLines />
                    : <File />
                  }
                </ListItemIcon>
                
                <ListItemText primary={file.name} />
              </ListItem>
              <LinearProgress variant="determinate" value={file.progress} sx={{background: 'none'}} />
            </div>
          ))}
        </List>
      }

      <Typography
        variant="subtitle2"
        sx={{
          marginTop: '1rem'
        }}
      >
        {locale === 'nl' ? 'Voor het ontvangen van een offerte is het essentieel dat de relevante documenten worden toegevoegd. Je kunt meerdere bestanden uploaden.' : 'To receive a quote, it is essential to attach the relevant documents. You can upload multiple files.'}
      </Typography>
    </Wizard>
  )
}
