import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CircularProgress from '@mui/material/CircularProgress';
import { Helmet } from 'react-helmet-async';
import '../Font.css';
import { useTheme } from '@mui/material/styles';
import { Upload, message, Divider } from 'antd';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Popover,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  Card,
  CardActions,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useSpring, animated } from '@react-spring/web';
import { AddCircle, ExpandMore } from '@mui/icons-material';
import { set } from 'lodash';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import stylisRTLPlugin from 'stylis-plugin-rtl';
// import React from 'react';
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [stylisRTLPlugin],
});
//
const Fade = React.forwardRef(function Fade(props, ref) {
  const { children, in: open, onClick, onEnter, onExited, ownerState, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} sx={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};
const filter = createFilterOptions();

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
// import { Inbox } from '@mui/icons-material';

// ----------------------------------------------------------------------
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const SubItem = styled(Paper)(({ theme }) => ({
  backgroundColor: '#F9FAFB',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
export default function ImportModel() {
  const navigate = useNavigate();

  const data = [
    'بیمه ندارد.',
    'بیمه تامین اجتماعی',
    'بیمه درمان تکمیلی',
    'بیمه‌ی عمر',
    'بیمه نیروهای مسلح',
    'بیمه ی خدمات درمانی',
  ];
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [chooseModelText, setChooseModelText] = React.useState(null);

  const handleClick1 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl(null);
  };

  const open1 = Boolean(anchorEl);
  const id1 = open1 ? 'simple-popover' : undefined;
  const [loading, setLoading] = React.useState(false);
  const [insurance, setInsurance] = React.useState(null);
  const [prev_url_to_file, setPrev_url_file] = React.useState(null);
  const [value, setValue] = React.useState([]);
  const [open_modal, setOpen_modal] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [randomVariable, setSomeRandomVariable] = React.useState(false);
  const [firstName, setFirstName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [personalNumber, setPersonalNumber] = React.useState(null);
  const [prevPersonalNumber, setPrevPersonalNumber] = React.useState(null);
  const [dateOfBirth, setDateOfBirth] = React.useState(null);
  const [insuranceType, setInsuranceType] = React.useState(null);
  const [medicalHistory, setMedicalHistory] = React.useState([]);
  const handleOpenModal = () => setOpen_modal(true);
  const handleCloseModal = () => setOpen_modal(false);
  const handleCloseDialog = () => setOpenDialog(false);
  const [file, setFile] = React.useState(null);
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const { id } = useParams();
  const [err, setErr] = React.useState(false);
  const currentUrl = window.location.href;
  console.log(currentUrl);
  React.useEffect(() => {
    if (currentUrl.includes('/patient_profile/')) {
      const loadPost = async () => {
        setLoading(true);

        const response = await axios.get('https://pzy1402.ir/get_patient/' + id);

        setFirstName(response.data.first_name.replace("'", '').replace("'", ''));
        setLastName(response.data.last_name.replace("'", '').replace("'", ''));
        setPersonalNumber(response.data.personal_id.replace("'", '').replace("'", ''));
        setPrevPersonalNumber(response.data.personal_id.replace("'", '').replace("'", ''));
        setDateOfBirth(response.data.date_of_birth.replace("'", '').replace("'", ''));
        setInsurance(response.data.insurance_type);

        const medicalHistoryArray = response.data.medical_history.split(', ');
        setValue(medicalHistoryArray);

        setUploadedFiles(response.data.record);

        setOpen(true);
        setLoading(false);
      };
      loadPost();
    }
  }, []);
  const recordTypes = [];
  const fileInput = React.useRef();
  function submit() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('/patient_profile/')) {
      console.log({
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        personal_number: personalNumber,
        insurance_type: insurance,
        medical_history: value,
        prev_personal_number: prevPersonalNumber,
      });
      axios
        .post('https://pzy1402.ir/edit_patient_info', {
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          personal_number: personalNumber,
          insurance_type: insurance,
          medical_history: value,
          prev_personal_number: prevPersonalNumber,
        })
        .then((response) => {
          console.log(response);
          setDataBaseCode(response.data);
          setPrevPersonalNumber(personalNumber);
        })
        .catch((error) => setErr(true));
    } else {
      axios
        .post('https://pzy1402.ir/add_patient', {
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          personal_number: personalNumber,
          insurance_type: insurance,
          medical_history: value,
          records: JSON.stringify(uploadedFiles),
        })
        .then((response) => {
          console.log(response);
          setDataBaseCode(response.data);
        })
        .catch((error) => setErr(true));
    }
  }

  const [medical_history, setMedical_history] = React.useState([
    { title: 'فشار خون بالا', code: 1001 },
    { title: 'دیابت', code: 1002 },
    { title: 'آسم', code: 1003 },
    { title: 'بیماری قلبی', code: 1004 },
    { title: 'سرطان', code: 1005 },
    { title: 'آرتریت', code: 1006 },
    { title: 'افسردگی', code: 1007 },
    { title: 'اضطراب', code: 1008 },
    { title: 'میگرن', code: 1009 },
    { title: 'اختلال تیروئید', code: 1010 },
    { title: 'آپاندیسیت', code: 1011 },
    { title: 'تب غلیظ', code: 1012 },
    { title: 'سنگ کلیه', code: 1013 },
    { title: 'بیماری صفراوی', code: 1014 },
    { title: 'کولیت التهابی', code: 1015 },
    { title: 'اگزما', code: 1016 },
    { title: 'پسوریازیس', code: 1017 },
    { title: 'آستئوپوروز', code: 1018 },
    { title: 'بیماری ریه مزمن انسدادی (COPD)', code: 1019 },
    { title: 'اسکلروز چندگانه', code: 1020 },
    { title: 'بیماری پارکینسون', code: 1021 },
    { title: 'بیماری آلزایمر', code: 1022 },
    { title: 'سکته مغزی', code: 1023 },
    { title: 'هپاتیت', code: 1024 },
    { title: 'ایدز / اچ آی وی', code: 1025 },
    { title: 'سل', code: 1026 },
    { title: 'لوپوس', code: 1027 },
    { title: 'آرتریت روماتوئید', code: 1028 },
    { title: 'بیماری کرون', code: 1029 },
    { title: 'بیماری سلیاک', code: 1030 },
    { title: 'حساسیت به غذا', code: 1031 },
    { title: 'حساسیت به دارو', code: 1032 },
    { title: 'آپنه خواب', code: 1033 },
    { title: 'چاقی', code: 1034 },
    { title: 'تاریخچه سیگاری', code: 1035 },
    { title: 'سوء مصرف الکل', code: 1036 },
    { title: 'سوء مصرف مواد', code: 1037 },
  ]);

  const records = [
    {
      title: 'آزمایشات',
      index: 1,
      items: [
        { title: 'شمارش کامل خون (CBC)', code: 2001 },
        { title: 'پانل متابولیک ابتدایی (BMP)', code: 2002 },
        { title: 'پانل متابولیک جامع (CMP)', code: 2003 },
        { title: 'پانل لیپیدی (کلسترول و تری‌گلیسرید)', code: 2004 },
        { title: 'آزمایش‌های عملکرد کبد (LFTs)', code: 2005 },
        { title: 'آزمایش‌های عملکرد کلیه (KFTs)', code: 2006 },
        { title: 'سطح قند خون (شامل نوبت قند و نوبت ناشتا)', code: 2007 },
        { title: 'هموگلوبین A1c (HbA1c)', code: 2008 },
        { title: 'آزمایش‌های عملکرد تیروئید (TFTs)', code: 2009 },
        { title: 'آزمایش ادرار (UA)', code: 2010 },
        { title: 'آزمایش‌های باکتری شناسی و حساسیت (C&S)', code: 2011 },
        { title: 'آزمایش‌های خون وریدی برای بررسی اختلال خونریزی (PT/INR، PTT)', code: 2012 },
        { title: 'گاز خون (ABGs)', code: 2013 },
        { title: 'بیومارکرهای قلبی (تروپونین، CK-MB)', code: 2014 },
        { title: 'آزمایش های سرولوژی (HIV، هپاتیت و غیره)', code: 2015 },
        { title: 'بیومارکرهای تشخیصی تومور (PSA، CA-125 و غیره)', code: 2016 },
        { title: 'نتایج آزمایش ژنتیکی', code: 2017 },
        { title: 'نتایج آزمایش مرتبط با دیابت', code: 2018 },
        { title: 'تست مرتبط با بیماری های قلبی', code: 2019 },
        { title: 'تست کلی مرتبط با سکته', code: 2020 },
        { title: 'آزمایشات مربوط به بیماری کلیوی', code: 2021 },
        { title: 'آزمایشات مربوط به بیماری پارکینسون', code: 2022 },
      ],
    },
    {
      title: 'گزارشات پاتولوژی',
      index: 2,
      items: [
        { title: 'Surgical pathology report', code: 201 },
        { title: 'Cytology report', code: 202 },
        { title: 'Autopsy report', code: 203 },
        { title: 'Molecular pathology report', code: 204 },
        { title: 'Hematology report', code: 205 },
        { title: 'Microbiology report', code: 206 },
        { title: 'Immunology report', code: 207 },
        { title: 'Blood bank report', code: 208 },
        { title: 'Toxicology report', code: 209 },
        { title: 'Endocrine pathology report', code: 210 },
        { title: 'Dermatopathology report', code: 211 },
      ],
    },

    {
      title: 'گزارشات رادیولوژی',
      index: 3,
      items: [
        { title: 'X-ray report', code: 101 },
        { title: 'CT scan report', code: 102 },
        { title: 'MRI report', code: 103 },
        { title: 'Ultrasound report', code: 104 },
        { title: 'Mammogram report', code: 105 },
        { title: 'PET scan report', code: 106 },
        { title: 'Bone scan report', code: 107 },
        { title: 'Nuclear medicine scan report', code: 108 },
        { title: 'Angiogram report', code: 109 },
        { title: 'Interventional radiology report', code: 110 },
      ],
    },
  ];

  function is_this_code(element, code) {
    return element.case_code === code;
  }
  const [open, setOpen] = React.useState(true);
  const [whichOneIsOpen, setWhichOneIsOpen] = React.useState(null);
  const [dataBaseCode, setDataBaseCode] = React.useState(null);

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClickSunHeader = (event, index) => {
    if (index === whichOneIsOpen) setWhichOneIsOpen(null);
    else setWhichOneIsOpen(index);
    console.log(whichOneIsOpen);
  };
  // function submit() {
  //   console.log({
  //     first_name: firstName,
  //     last_name: lastName,
  //     date_of_birth: dateOfBirth,
  //     personal_number: personalNumber,
  //     insurance_type: insurance,
  //     medical_history: value,
  //     prev_personal_number: prevPersonalNumber,
  //   });
  //   axios
  //     .post('https://pzy1402.ir/edit_patient_info', {
  //       first_name: firstName,
  //       last_name: lastName,
  //       date_of_birth: dateOfBirth,
  //       personal_number: personalNumber,
  //       insurance_type: insurance,
  //       medical_history: value,
  //       prev_personal_number: prevPersonalNumber,
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       setDataBaseCode(response.data);
  //       setPrevPersonalNumber(personalNumber);
  //     })
  //     .catch((error) => console.log(error));
  // }

  async function handleFileChange(event, item_name, item_code, parent_cat_code) {
    setFile(event.target.files[0]);
    console.log(event.target.files[0].name);

    const res = await handleSubmit(event, event.target.files[0], item_name, item_code, parent_cat_code);
  }
  async function handleFileChange2(event, item_name, item_code, parent_cat_code) {
    console.log('1');
    const res = await handleDelete(event, prev_url_to_file.url_to_file);
    console.log('2');
    setFile(event.target.files[0]);
    console.log('3');
    console.log(event.target.files[0].name);
    console.log('4');
    const res2 = await handleSubmit2(event, event.target.files[0], item_name, item_code, parent_cat_code);
    console.log('5');
  }

  async function handleSubmit(event, file, item_name, item_code, parent_cat_code1) {
    // event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('case', item_name);
    formData.append('case_code', item_code);
    formData.append('parent_cat_code', parent_cat_code1);
    formData.append('patient_id', personalNumber);
    setUploading(true);
    try {
      const response = await axios.post('https://pzy1402.ir/add_file', formData);
      console.log(response);
      setUploadedFiles([
        ...uploadedFiles,
        {
          name: file.name,
          url_to_file: response.data,
          case_name: item_name,
          case_code: item_code,
          parent_cat_code: parent_cat_code1,
        },
      ]);
      console.log(uploadedFiles);
    } catch (error) {
      console.log(error);
    }
    setUploading(false);

    return 'z';
  }
  async function handleSubmit2(event, file, item_name, item_code, parent_cat_code1) {
    // event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('case', prev_url_to_file.case_name);
    formData.append('case_code', prev_url_to_file.case_code);
    formData.append('parent_cat_code', parent_cat_code1);
    formData.append('patient_id', personalNumber);
    setUploading(true);
    try {
      const response = await axios.post('https://pzy1402.ir/add_file', formData);
      console.log(response);
      setUploadedFiles([
        ...uploadedFiles,
        {
          name: file.name,
          url_to_file: response.data,
          case: item_name,
          case_code: item_code,
          parent_cat_code: parent_cat_code1,
        },
      ]);
      console.log(uploadedFiles);
    } catch (error) {
      console.log(error);
    }
    setUploading(false);

    return 'z';
  }

  async function handleDelete(event, url_to_file) {
    // event.preventDefault();
    const formData = new FormData();
    formData.append('file_url', url_to_file);
    setUploading(true);
    try {
      const response = await axios.post('https://pzy1402.ir/delete_file', formData);
    } catch (error) {
      console.log(error);
    }
    console.log(uploadedFiles);
    const new_uploded_files = uploadedFiles.filter((dict) => dict.url_to_file !== prev_url_to_file.url_to_file);
    // new_uploded_files=filter(uploadedFiles, (tmp_file) => tmp_file.url_to_file!==prev_url_to_file.url_to_file);
    console.log(new_uploded_files);

    setUploadedFiles(new_uploded_files);
    setUploading(false);

    return 'z';
  }

  const chooseInsurance = (event) => {
    setInsurance(event.target.value);
    console.log(insurance);
  };
  const textFieldStyle = {
    // margin: '10px',
    // width: '90%',
    // direction: 'rtl',
    fontFamily: 'Calibri',
    '& label': {
      // left: 'unset',
      // right: '1.75rem',
      // transformOrigin: 'right',
      // fontSize: '0.8rem',
      fontFamily: 'Calibri',
    },
    '& legend': {
      // textAlign: 'right',
      // fontSize: '0.6rem',
      fontFamily: 'Calibri',
    },
    '& placeholder': {
      // textAlign: 'right',
      // fontSize: '0.6rem',
      fontFamily: 'Calibri',
    },
  };
  const StyledChip = {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& root': {
      width: '100%',
      position: 'relative',
    },
    '& deleteIcon': {
      position: 'absolute',
      right: 0,
    },
  };
  const selectStyle = {
    margin: '10px',
    width: '90% !important',
    fontFamily: 'Calibri',
    '& label': {
      left: 'unset',
      right: '1.75rem',
      transformOrigin: 'right',
      fontSize: '0.8rem',
      fontFamily: 'Calibri',
    },
    '& legend': {
      textAlign: 'right',
      fontSize: '0.6rem',
      fontFamily: 'Calibri',
    },
  };
  const textFieldInputProps = {
    style: {
      fontFamily: 'Calibri',
      fontSize: '16px',
      fontWeight: 500,
      textAlign: 'center',
    },
  };
  const [test, setTest] = React.useState(null);

  const handleTestChoice = (event) => {
    setTest(event.target.value);
  };
  const [fileList, setFileList] = React.useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const theme = useTheme();
  const { Dragger } = Upload;
  function handleChange(event, newValue) {
    console.log(value);
    console.log(value);
    console.log(value);
    console.log(newValue);
    setValue(newValue);
    setMedicalHistory(newValue);
    console.log(medicalHistory);
    console.log('hi');
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // console.log(medicalHistory)
      console.log(value);
      // const newValue = event.target.value.trim();
      // if (newValue !== '' && !medical_history.some((item) => item.title === newValue)) {
      //   const newOption = { title: newValue, code: medical_history.length + 1 };
      //   // medical_history.push(newOption);
      //   setValue([...value, newValue]);
      //   // setValue([...value, newValue]);
      //   setMedicalHistory([...medicalHistory, newOption]);
      //   console.log(medicalHistory)
      //   console.log(value)
      // }
    }
    // console.log(medicalHistory)
    // console.log(value)
  };
  const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <>
      <>
        <Helmet>
          <title> پزشک‌یار | افزوددن مدل AI </title>
        </Helmet>

        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 5, textAlign: 'right', fontFamily: 'Calibri' }}>
            افزودن مدل جدید برا هوش مصنوعی
          </Typography>
          <Grid container spacing={2} sx={{ direction: 'rtl' }}>
            <Grid item xs={6}>
              <Item>
                <Typography fontFamily="Calibri">اطلاعات پایه</Typography>

                <TextField
                  label={'نام بیماری یا عارضه'}
                  id="personal_number"
                  sx={textFieldStyle}
                  inputProps={textFieldInputProps}
                  value={personalNumber}
                  onChange={(event) => {
                    setPersonalNumber(event.target.value);
                  }}
                />
                <CacheProvider value={cacheRtl}>
                  <Autocomplete
                    // multiple
                    id="tags-filled"
                    options={medical_history.map((option) => option.title)}
                    value={value}
                    style={{ direction: 'rtl', marginTop: '30px' }}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          deleteIcon={<HighlightOffIcon style={{ marginLeft: '7px' }} />}
                          label={<Typography fontFamily={'Calibri'}>{option}</Typography>}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    renderInput={(params) => (
                      <TextField
                        sx={textFieldStyle}
                        inputProps={textFieldInputProps}
                        {...params}
                        label="تست، داده یا آزمایش مربوطه"
                      />
                    )}
                  />
                </CacheProvider>
                <div>
                  <Button endIcon={<ExpandMore />} aria-describedby={id1} variant="contained" onClick={handleClick1}>
                    {!chooseModelText ? 'افزودن مدل موجود(از پیش آموزش دیده)' : 'ایجاد مدل بر اساس تشخیص های قبلی'}{' '}
                  </Button>
                  <Popover
                    id={id1}
                    open={open1}
                    anchorEl={anchorEl}
                    onClose={handleClose1}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                      cursor: 'pointer',
                    }}
                    onClick={()=>setChooseModelText(!chooseModelText)}
                  >
                    <Typography sx={{ p: 2 }}>
                      {chooseModelText ? 'افزودن مدل موجود(از پیش آموزش دیده)' : 'ایجاد مدل بر اساس تشخیص های قبلی'}
                    </Typography>
                  </Popover>
                </div>

                <Button>
                  <Typography>افزودن مدل موجود(از پیش آموزش دیده)</Typography>
                </Button>
                <Button>
                  <Typography>ایجاد مدل بر اساس تشخیص های قبلی</Typography>
                </Button>

                <Button
                  onClick={() => {
                    submit();
                    // setSomeRandomVariable(true);
                    setOpenDialog(true);
                    setTimeout(() => {
                      if (openDialog) {
                        handleCloseDialog();
                        navigate('/dashboard/records', { replace: true });
                      }
                    }, 5000);
                  }}
                  variant="contained"
                >
                  <Typography fontFamily="Calibri">ثبت</Typography>
                </Button>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item style={{ height: '100%' }}>
                <Typography fontFamily="Calibri">مدارک پزشکی</Typography>

                <>
                  <List
                    sx={{
                      width: '100%',
                      // maxWidth: 360,
                      bgcolor: 'background.paper',
                      position: 'relative',
                      overflow: 'auto',
                      maxHeight: 300,
                      '& ul': { padding: 0 },
                    }}
                    subheader={<li />}
                  >
                    {
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {uploadedFiles.map((subItem, index) => (
                          <Card
                            sx={{
                              width: '30%',
                              display: 'block',
                              margin: '10px',
                            }}
                          >
                            <div style={{ cursor: 'pointer' }}>
                              <Typography style={{ textAlign: 'center', backgroundColor: '#D3D3D3' }}>
                                {subItem.case_name}
                              </Typography>
                              <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <div
                                  style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '10px',
                                  }}
                                >
                                  hihi
                                </div>
                                <div
                                  style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography
                                    fontFamily="Calibri"
                                    style={{ overflow: 'hidden', height: '100px', marginBottom: '30px' }}
                                  >
                                    {subItem.name}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                justifyContent: 'space-between',
                                display: 'flex',
                                position: 'absolute',
                                bottom: '0px',
                              }}
                            >
                              <Button
                                size="small"
                                color="primary"
                                style={{ textAlign: 'right', justifyContent: 'flex-start' }}
                                onClick={(event) => {
                                  console.log(subItem);
                                  handleDelete(event, subItem.url_to_file);
                                }}
                              >
                                <Typography fontFamily={'Calibri'} style={{ textAlign: 'right' }}>
                                  {' '}
                                  حذف
                                </Typography>
                              </Button>
                              <Button
                                size="small"
                                color="primary"
                                style={{ textAlign: 'left', justifyContent: 'flex-end' }}
                              >
                                <Typography
                                  fontFamily={'Calibri'}
                                  style={{ textAlign: 'right' }}
                                  onClick={() => {
                                    setPrev_url_file(subItem);
                                    document.getElementById('getFile' + index + 'l').click();
                                  }}
                                >
                                  <input
                                    id={'getFile' + index + 'l'}
                                    type="file"
                                    onChange={(e) => {
                                      console.log(subItem);
                                      handleFileChange2(e, subItem.title, subItem.code, subItem.parent_cat_code);
                                    }}
                                    style={{ display: 'none' }}
                                  />
                                  تصحیح
                                </Typography>
                              </Button>
                            </div>
                          </Card>
                        ))}
                        <Divider />
                      </div>
                    }
                  </List>
                </>
                <Button
                  disabled={personalNumber === null}
                  variant="outlined"
                  endIcon={<AddIcon />}
                  fontFamily="Calibri"
                  onClick={handleOpenModal}
                >
                  <Typography fontFamily="Calibri">افزودن مدرک جدید</Typography>
                </Button>
              </Item>
            </Grid>
          </Grid>
          <div
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              paddingTop: '10px',
            }}
          ></div>
        </Container>
      </>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open_modal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={open_modal}>
          <Box sx={style}>
            <List
              sx={{
                width: '100%',
                // maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                height: '444px',
                '& ul': { padding: 0 },
              }}
              subheader={<li />}
            >
              {records.map((item) => (
                <li>
                  <ul>
                    <ListSubheader
                      onClick={(event) => {
                        handleClickSunHeader(event, item.index);
                      }}
                    >
                      <Typography fontFamily={'Calibri'} style={{ direction: 'rtl', textAlign: 'right' }}>
                        {item.title}
                      </Typography>
                    </ListSubheader>
                    <Collapse
                      in={whichOneIsOpen === item.index}
                      timeout="auto"
                      unmountOnExit
                      style={{ display: 'inline' }}
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {uploadedFiles.map((subItem, index) => (
                          <Card
                            sx={{
                              width: '30%',
                              display: subItem.parent_cat_code === item.index ? 'block' : 'none',
                              margin: '10px',
                            }}
                          >
                            <div style={{ cursor: 'pointer' }}>
                              <Typography
                                fontFamily="Calibri"
                                style={{ textAlign: 'center', backgroundColor: '#D3D3D3' }}
                              >
                                {subItem.case_name}
                              </Typography>
                              <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <div
                                  style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '10px',
                                    margin: '10px',
                                  }}
                                ></div>
                                <div
                                  style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography fontFamily="Calibri">{subItem.name}</Typography>
                                </div>
                              </div>
                            </div>
                            <CardActions style={{ justifyContent: 'space-between' }}>
                              <Button size="small" color="primary" style={{ textAlign: 'center' }}>
                                حذف
                              </Button>
                              <Button size="small" color="primary" style={{ textAlign: 'center' }}>
                                تصحیح
                              </Button>
                            </CardActions>
                          </Card>
                        ))}
                        <Divider />
                        <Grid container spacing={2}>
                          {item.items.map((subItem, index) => (
                            <Grid item xs={3}>
                              <Chip
                                sx={StyledChip}
                                icon={
                                  <div>
                                    {<AddCircle onClick={() => document.getElementById('getFile' + index).click()} />}
                                    <input
                                      id={'getFile' + index}
                                      type="file"
                                      onChange={(e) => {
                                        handleFileChange(e, subItem.title, subItem.code, item.index);
                                      }}
                                      style={{ display: 'none' }}
                                    />
                                  </div>
                                }
                                label={
                                  <Typography fontFamily={'Calibri'} style={{ direction: 'rtl', fontSize: '0.75rem' }}>
                                    {subItem.title}
                                  </Typography>
                                }
                              />
                            </Grid>
                          ))}{' '}
                        </Grid>
                      </div>
                    </Collapse>
                    {/* <ImgCrop rotationSlider> */}

                    {/* </ImgCrop> */}
                    {/* {item.items.map((subItem) => (
                      <ListItem key={subItem.code}>
                        <ListItemText primary={subItem.title} />
                      </ListItem>
                    ))} */}
                  </ul>
                </li>
              ))}
            </List>
          </Box>
        </Fade>
      </Modal>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle fontFamily={'Calibri'} style={{ direction: 'rtl', textAlign: 'right' }} id="alert-dialog-title">
          {err
            ? 'خطا'
            : currentUrl.includes('/patient_profile/')
            ? 'تغییرات با موفقیت ثبت شد.'
            : 'پذیرش بیمار با موفقیت انجام شد.'}
        </DialogTitle>
        <DialogContent>
          {err ? (
            currentUrl.includes('/patient_profile/') ? (
              <DialogContentText
                id="alert-dialog-description"
                fontFamily={'Calibri'}
                style={{ direction: 'rtl', textAlign: 'right' }}
              >
                مشکلی در ثبت تغییرات وجود داشت، مجددا تلاش کنید.
              </DialogContentText>
            ) : (
              <DialogContentText
                id="alert-dialog-description"
                fontFamily={'Calibri'}
                style={{ direction: 'rtl', textAlign: 'right' }}
              >
                یک بیمار با این کد ملی در سیستم وجود دارد.
              </DialogContentText>
            )
          ) : null}
        </DialogContent>
        <DialogActions style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            onClick={() => {
              if (!currentUrl.includes('/patient_profile/')) {
                setFirstName('');
                setLastName('');
                setPersonalNumber('');
                setDateOfBirth('');
                setInsurance('');
                setPrevPersonalNumber('');
                setUploadedFiles([]);
                setValue([]);
                setOpenDialog(false);
                setErr(false);
              } else {
                setOpenDialog(false);
              }
            }}
          >
            <Typography fontFamily="Calibri">بستن</Typography>
          </Button>

          {err ? (
            <Button
              onClick={() => {
                handleCloseDialog();
                window.location.href = '/dashboard/patient_profile/' + personalNumber;
                navigate('/dashboard/patient_profile/' + personalNumber, { replace: true });
              }}
            >
              <Typography fontFamily="Calibri">نمایش مشخصات</Typography>
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleCloseDialog();
                window.location.href = '/dashboard/records';
                navigate('/dashboard/records', { replace: true });
              }}
            >
              <Typography fontFamily="Calibri">لیست بیماران</Typography>
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={uploading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
