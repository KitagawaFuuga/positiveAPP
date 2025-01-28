import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { PrintScreenProps, getColorByScore, extractScore } from "@/component/components";
import { Hearts } from 'react-loader-spinner';

const PrintScreen = ({ print, isLoading }: { print: PrintScreenProps, isLoading: boolean }) => {
  const [isInputDisabled, setIsInputDisabled] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setIsInputDisabled(true);  
      const timer = setTimeout(() => {
        setIsInputDisabled(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Check if print is available before rendering buttons
  if (!print) {
    return <div>Loading...</div>;  // You can show a loading message or handle this case as you prefer
  }

  return (
    <div className={`container ${isLoading || isInputDisabled ? 'loading' : ''}`}>
      <div>
        <div className={styles.buttonPrintScreen}>
          <div>
            <button
                onClick={print.handleBackClick ? print.handleBackClick : undefined}
                disabled={print.count <= 0 || isLoading || isInputDisabled}
                className={styles.backbutton}
              >
                前の選択肢に戻る
            </button>
          </div>
          <div className={styles.positivemodeButton}>

          {/* 通常モードボタン */}
          <button 
            onClick={() => print.handlepositiveClick(print.count)}
            aria-pressed={print.positivemode}
            disabled={isLoading || isInputDisabled || print.positivemode} 
            style={{fontSize: "1.1rem"}}
            // positivemodeがtrueの場合は無効化
          >
            通常モード
          </button>

          {/* ポジティブモードボタン */}
          <button
            onClick={() => print.handlepositiveClick(print.count)}
            aria-pressed={!print.positivemode}
            disabled={isLoading || isInputDisabled || !print.positivemode}
            style={{fontSize: "1.1rem"}}
          >
            ポジティブモード
          </button>

          </div>
        </div>

        <div className={styles.happncontainer}>
          <div className={styles.inputText}>
            <p>いま入力された行動は</p>
            <p className={styles.happn}>{(print.input as string).replace("。なので", "") || "デフォルトのテキスト"}</p>
          </div>
          <div className={styles.inputText}>
            <p>最初に入力された行動は</p>
            <p className={styles.happn2}>{print.firstinput}</p>
          </div>
        </div>

        {(isLoading || isInputDisabled) ? ( // isInputDisabled中もHeartsを表示
          <div className={styles.Heart}>
            <Hearts
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="hearts-loading"
              visible={true}
            />
          </div>
        ) : (
          print.getAllPossibilities.size > 0 && print.getAllPossibilities.get(print.count) ? (
            <div className="possibility-list">
              {print.getAllPossibilitiesLog.get((print.input as string + "。なので"))?.possibilities ? (
                <div>
                  {print.getAllPossibilitiesLog.get((print.input as string) + "。なので")?.possibilities
                    .map((possibility, index) => {
                      const score = extractScore(print.getAllPossibilitiesLog.get(print.input as string + "。なので")?.scores[index] as string);

                      // positivemodeがtrueかつscoreが50以下の場合、その要素を表示しない
                      if (print.positivemode && score <= 50) {
                        return null;
                      }

                      return (
                        <div key={index} className="possibility-row">
                          <button
                            className="possibility-btn"
                            onClick={() => print.handlePossibilityClick(possibility, index)}
                            style={{
                              backgroundColor: print.getAllPossibilitiesLog.get(print.input as string + "。なので")?.scores[index]
                                ? getColorByScore(score)
                                : 'rgba(227, 242, 253, 0.3)',
                            }}
                            disabled={isLoading || isInputDisabled} // isLoadingかつ5秒間はボタン無効
                          >
                            {possibility}
                          </button>
                          <div className="possibility-score">
                            {print.getAllPossibilitiesLog.get(print.input as string + "。なので")?.scores[index]}
                          </div>
                          <div className="possibility-reason">
                            {print.getAllPossibilitiesLog.get(print.input as string + "。なので")?.reasons[index]}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p>No possibilities found. Creating new possibilities...</p>
              )}
            </div>
          ) : (
            <div className={styles.Heart}>
              <Hearts
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="hearts-loading"
                visible={true}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PrintScreen;
