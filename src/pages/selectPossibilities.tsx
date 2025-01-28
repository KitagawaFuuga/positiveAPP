import React from 'react';
import { replaceText } from '../component/components';
import styles from '../styles/Home.module.css';

// Propsの型定義
interface SelectPossibilitiesProps {
  getPossibilities?: string[];
}

// メインコンポーネント
const SelectPossibilities: React.FC<SelectPossibilitiesProps> = ({ getPossibilities = [] }) => {
  return (
    <>
      <div className={styles.clickedinfo}>
        <center>
          <DownloadCSVButton getPossibilities={getPossibilities} />
          <h2 style={{fontSize: "1.3rem"}}>選択された要素</h2>
        </center>
        {getPossibilities.map((possibility, index) => (
          // React.Fragmentをショートハンド構文に修正
          <>
            <center>
              <p>{replaceText(possibility)}</p>
              {index < getPossibilities.length - 1 && <p>↓</p>}
            </center>
          </>
        ))}
      </div>
    </>
  );
};

// CSVダウンロードボタンのコンポーネント
interface DownloadCSVButtonProps {
  getPossibilities: string[];
}

const DownloadCSVButton: React.FC<DownloadCSVButtonProps> = ({ getPossibilities }) => {
  const downloadCSV = () => {
    // replaceTextで変換後にCSV形式に変換（カンマで区切って行で保存）
    const csvContent = getPossibilities.map(possibility => replaceText(possibility)).join(',');

    // UTF-8 BOMを追加して文字化け対策
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

    // ダウンロードリンク作成
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'selected_possibilities.csv');  // ファイル名

    // 自動クリックでダウンロード
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={downloadCSV}
      style={{fontSize: "0.80rem", marginTop: "1px", height: "2.5rem", width: "10rem"}}
    >
      CSVをダウンロード
    </button>
  );
};

export default SelectPossibilities;
