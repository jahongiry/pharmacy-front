import {Typography} from "antd";
import {Dispatch, SetStateAction} from "react";
import {FileUploader} from "react-drag-drop-files";
import s from './index.module.css'
import download from '../../../../assets/icons/download.svg'
import image from '../../../../assets/icons/image.svg'
import file from '../../../../assets/icons/file.svg'
import imgTrash from '../../../../assets/icons/imgTrash.svg'

const { Text} = Typography

interface IProps {
  files: any[]
  isCanEdit: boolean
  setClickedFile: Dispatch<SetStateAction<any>>
  handleAddFile: any
  setIsDeleteFile: Dispatch<SetStateAction<boolean>>
  title: string
}

export const FilesComponent = (
  {
    files,
    isCanEdit,
    setClickedFile,
    setIsDeleteFile,
    handleAddFile,
    title
  }: IProps) => {

  const getFileFormat = (filename: string) => {
    if(filename) {
      // @ts-ignore
      let extension = filename?.split('.').pop().toLowerCase();

      const formatMap = {
        'jpg': 'IMAGE',
        'jpeg': 'IMAGE',
        'png': 'IMAGE',
        'gif': 'IMAGE',
        'bmp': 'IMAGE',
        'svg': 'IMAGE',
        'pdf': 'PDF',
        'doc': 'DOC',
        'docx': 'DOCX',
        'xls': 'XLS',
        'xlsx': 'XLSX',
      };

      if (formatMap.hasOwnProperty(extension)) {
        // @ts-ignore
        return formatMap[extension];
      } else {
        return "Неизвестный формат";
      }
    }
  }

  return (
    <div
      className={s.box}
    >
      <div
        className={s.filesBox}
      >
        {files?.length > 0
          ? files.map((el: any) => {
            return (
              <div
                className={s.fileItem}
              >
                <a
                  href={`http://45.82.177.11:8000${el.source}`}
                  target={'_blank'}
                  className={s.link}
                >
                  <div
                    className={s.imgBox}
                  >
                    {/*<img src={getFileFormat(el.filename) === 'IMAGE' ? image : file} alt={'image'}/>*/}
                    <img src={getFileFormat(el.filename) === 'IMAGE' ? `http://45.82.177.11:8000${el.source}` : file}/>
                  </div>
                  <span>
                    {el.filename}
                  </span>
                </a>
                {isCanEdit &&
                  <button
                    onClick={() => {
                      setClickedFile(el)
                      setIsDeleteFile(true)
                    }}
                  >
                    <img src={imgTrash} />
                  </button>
                }
              </div>
            )
          }) : <p>Нет файлов</p>}
      </div>


      {isCanEdit &&
        <FileUploader
          handleChange={(file: any) => {
            handleAddFile(file as FileList)
          }}
          name="file"
        >
          <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
            <button
              className={s.btn}
            >
              <img src={download} alt={'download'}/>
              <span>Загрузить файл</span>
            </button>
          </label>
        </FileUploader>
      }
    </div>
  )
}
