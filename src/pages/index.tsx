import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

const App = () => {
  const [inputText, setInputText] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (!inputText.trim()) {
      alert('テキストを入力してください')
      return;
    }
    if (inputText) {
      router.push(`/lookpage?input=${encodeURIComponent(inputText)}&firstinput=${encodeURIComponent(inputText)}&count=0&mode=false`);
    }else if (!inputText.trim()) {
      alert('テキストを入力してください');
      return;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div className={styles.firsts}>
        <center>
          <h1 className={styles.topTitle}>後悔を減らしたい</h1>
          <p>行動に対して恐怖を抱えている人は多い。</p>
          <p>自分でも行動したいのに行動できない。</p>
          <br />
          <p>そんな人に対して少しでも気を楽に出来るようにシステムを作ってみました。</p>
          <p>少しだけ、未来で何が起きるか見てみませんか。</p>
          <h1>行動を入力して、未来を見てみましょう</h1>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ width: '300px', padding: '10px', marginRight: '40px' }}
          />
        </center>
        <center>
          <button onClick={handleSubmit} style={{ marginRight: '30px' }}>みてみる</button>
        </center>
        <div className={styles.explain}>
          <p className={styles.explainTitle}>このシステムは？</p>
          <hr className={styles.bobo}/>
          <br />
          <center>
            <ul>
              <br />
              <p>このシステムは行動を入力すると起きうる可能性が次々と提示されて、その可能性を更に選択するとその先の起きうる可能性が提示されるシステムです。</p>
              <br />
              <p>0点が最悪の事態で、人生に大きなダメージを与える結果。50点以下は一般的に悪いこと。50点以上は一般的に良いこと。100点は極めて幸運な結果です。</p>
              <br />
              <p>前の選択肢に戻りたい場合、ブラウザの戻るボタンは押さないで画面に表示されている戻るボタンを押してください。</p>
              <br />
              <p>通常モードとポジティブモードの切り替えが出来ます。</p>
              <br />
              <p>もういいかなと思ったら、ダウンロードボタンを押してデータをダウンロードしてアンケートに添付してください。</p>
              <br />
            </ul>
          </center>
        </div>
      </div>
    </div>
  )
}

export default App;
