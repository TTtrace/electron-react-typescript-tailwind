import { useState, useEffect } from 'react';
import { Button, styled } from '@mui/material';

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

function ConfigButton({
  title,
  filename,
  handleClick,
}: {
  title: string;
  filename: string;
  handleClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 w-60 h-32">
      <Button component="label" variant="contained" className="w-32">
        {title}
        <VisuallyHiddenInput type="file" onChange={handleClick} />
      </Button>
      <div className="filename">{filename}</div>
    </div>
  );
}

export default function ConfigArea() {
  const [configFile, setConfigFile] = useState('config');
  const [billFile, setBillFile] = useState('wechat_bill');
  const [beanFile, setBeanFile] = useState('output.bean');
  const [checked, setChecked] = useState(false);

  function handleConfig(event: React.ChangeEvent<HTMLInputElement>) {
    let file = event.target.files?.[0].name;
    if (file) {
      setConfigFile(file);
    }
  }

  function handleBill(event: React.ChangeEvent<HTMLInputElement>) {
    let file = event.target.files?.[0].name;
    if (file) {
      setBillFile(file);
    }
  }

  function handleBean(event: React.ChangeEvent<HTMLInputElement>) {
    let file = event.target.files?.[0].name;
    if (file) {
      setBeanFile(file);
    }
  }

  function handleCheck() {
    setChecked(!checked);
  }

  return (
    <div className="flex space-x-4">
      <ConfigButton
        title={'选择配置'}
        filename={configFile}
        handleClick={handleConfig}
      />
      <ConfigButton
        title={'解析账单'}
        filename={billFile}
        handleClick={handleBill}
      />
      <ConfigButton
        title={'输出账本'}
        filename={beanFile}
        handleClick={handleBean}
      />
      {/* <ConfigButton
        title={'开始核对'}
        filename={checked}
        handleClick={handleCheck}
      /> */}
    </div>
  );
}
