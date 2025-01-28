import PrintScreen from "./PrintScreen";
import ChartPage from "./Chartpagedesu";
import SelectPossibilities from "./selectPossibilities";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import {
  PossibilityData,
  replaceText,
  extractScore,
  extractTextWithoutScore,
  getColorByScore,
  PrintScreenProps,
  sortBySecondRow
} from "../component/components";
import { Edge, Node, ReactFlowProvider} from 'react-flow-renderer';
import styles from '../styles/Home.module.css';
import { fetchPossibilities } from "../chatgpt";

const Lookpage = () => {
  const router = useRouter();
  const { input, firstinput, newCount } = router.query;

  // State管理
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getPossibilities, setGetPossibilities] = useState<string[]>([firstinput as string + "。なので"]);
  const [getPossibilitiesId, setGetPossibilitiesId] = useState<string[]>(["0-0"]);
  const [getAllPossibilities, setGetAllPossibilities] = useState<Map<number, PossibilityData>>(new Map());
  const [count, setCount] = useState<number>(Number(newCount) || 0);
  const [getAllPossibilitiesLog, setGetAllPossibilitiesLog] = useState<Map<string, PossibilityData>>(new Map());
  const [positivemode, setPositivemode] = useState<boolean>(false);
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '0-0',
      data: { 
        label: firstinput as string,
        hoverInfo: "Additional information on hover"  // Add hover info here
      },
      position: { x: 380, y: 0 },
      style: { backgroundColor: 'white', color: '#000', border: '1px solid #000000'},
    },
  ]);
  const [edges, setEdges] = useState<Edge[]>([
    {id: '0-0', source: '0-0', target: '0-0',},
  ]);

  // PrintScreen用のpropsを準備
  const printss: PrintScreenProps | null = {
    input: input as string || '',
    firstinput: firstinput as string || '',
    count: count,
    positivemode: positivemode,
    
    // Possibilityクリック時の処理
    handlePossibilityClick: async (possibility: string, index: number) => {
      const newCount = count + 1;
      setCount(newCount);
      setGetPossibilities([...getPossibilities, possibility + "。なので"]);
      setGetPossibilitiesId([...getPossibilitiesId, `${newCount}-${index + 1}`]);
      await router.push(`/lookpage?input=${encodeURIComponent(replaceText(possibility))}&count=${newCount}&firstinput=${firstinput}&mode=${positivemode}`);
    },
    
    // 戻るボタンの処理
    handleBackClick: async () => {
      if (count > 0) {
        const newCount = count - 1;
        
        // getPossibilities, getPossibilitiesId を直接変更せず、新しい配列を作成
        const newGetPossibilities = [...getPossibilities];
        const newGetPossibilitiesId = [...getPossibilitiesId];
        newGetPossibilities.pop();
        newGetPossibilitiesId.pop();
        
        setCount(newCount);
        setGetPossibilities(newGetPossibilities);
        setGetPossibilitiesId(newGetPossibilitiesId);
        
        // Mapを新しいインスタンスとしてセット
        const newGetAllPossibilities = new Map(getAllPossibilities);
        newGetAllPossibilities.delete(count);
        setGetAllPossibilities(newGetAllPossibilities);
        
        // 新しいノードとエッジの配列を作成し、状態を更新
        setNodes((prevNodes) => prevNodes.filter((node) => !node.id.startsWith(`${count}-`)));
        setEdges((prevEdges) => prevEdges.filter((edge) => !edge.id.startsWith(`${count}-`)));
        
        
        try {
          // ページ遷移
          await router.push(`/lookpage?input=${encodeURIComponent(newGetPossibilities[newCount].replace("。なので", ""))}&count=${newCount}&firstinput=${firstinput}&mode=${positivemode}`);
        } catch (error) {
          console.error("ページ遷移中にエラーが発生しました:", error);
        }
      }
    },
    
    // ポジティブモードの切り替え
    handlepositiveClick: async (num: number) => {
      setPositivemode((prevMode) => {
        const newMode = !prevMode;
        router.push(`/lookpage?input=${encodeURIComponent(replaceText(getPossibilities[num]))}&count=${num}&firstinput=${firstinput}&mode=${newMode}`);
        return newMode; 
      });
    },
    
    getAllPossibilitiesLog: getAllPossibilitiesLog || new Map(),
    getAllPossibilities: getAllPossibilities || new Map(),
    getPossibilities: getPossibilities || new Map(),
  };

  // API呼び出しとノード・エッジの設定を行うEffect
  useEffect(() => {
    let isMounted = true;

    const setFlowData = async () => {
      const horizontalSpacing = 250;
      const verticalSpacing = 300;
      const possibilitiesData = getAllPossibilities.get(count - 1);
      const possibilitiesLength = possibilitiesData ? possibilitiesData.possibilities.length : 0;


      if (!nodes.some((node) => node.id.startsWith(`${count}-`))) {
        setEdges((prevEdges) => [
          ...prevEdges,
          {
            id: `${count}-${count + 1}`,
            source: `${getPossibilitiesId[count - 1]}`,
            target: `${getPossibilitiesId[count]}`,
          },
        ]);

        setNodes((prevNodes) => [
          ...prevNodes,
          ...Array.from({ length: possibilitiesLength }, (_, i) => {
            const score = extractScore(getAllPossibilitiesLog.get(getPossibilities[count - 1])?.scores[i] || '');
            const isLowScore = score <= 50; // 50点以下かどうかを判定
        
            return {
              id: `${count}-${i + 1}`,
              data: {
                label: extractTextWithoutScore(getAllPossibilitiesLog.get(getPossibilities[count - 1])?.possibilities[i] || ''),
                hoverInfo: extractTextWithoutScore(getAllPossibilitiesLog.get(getPossibilities[count - 1])?.reasons[i] || ''),
                hoverInfo2: getAllPossibilitiesLog.get(getPossibilities[count - 1])?.scores[i] || '',
              },
              position: { x: 500 + (i - possibilitiesLength / 2) * horizontalSpacing, y: verticalSpacing * count },
              style: {
                backgroundColor: getColorByScore(score),
                color: '#000',
                border: getPossibilitiesId.at(-1) === `${count}-${i + 1}` ? '5px solid #FF0000' : '0px solid #000',
              },
              className: getPossibilitiesId.at(-1) === `${count}-${i + 1}` ? 'blinking-node' : isLowScore ? 'lowScore' : '', // 点数が50以下ならlowScoreを設定
            };
          }),
        ]);
      }
    };
  

    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (input && isMounted) {
          const newPossibilities = [...getPossibilities];
          const data = await fetchPossibilities(newPossibilities);
          const getData = sortBySecondRow(data)

          if (getData && getData.length > 0) {
            if (!getAllPossibilitiesLog.has(input + "。なので")) {
              await setGetAllPossibilitiesLog(new Map(getAllPossibilitiesLog.set(input + "。なので", {
                possibilities: getData[0],
                scores: getData[1],
                reasons: getData[2],
              })));
            }

            if (!getAllPossibilities.has(count)) {
              await setGetAllPossibilities(new Map(getAllPossibilities.set(count, {
                possibilities: getData[0],
                scores: getData[1],
                reasons: getData[2],
              })));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching possibilities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    setFlowData();

    return () => {
      isMounted = false;
    };
  }, [count, getAllPossibilities, getAllPossibilitiesLog, getPossibilities, getPossibilitiesId, input, nodes]);

  return (
    <>
      <div className={styles.lookpage}>
        <div className={styles.componentWrappe}>
          <SelectPossibilities getPossibilities={getPossibilities} />
        </div>
        <div className={styles.componentWrapper}>
          <PrintScreen print={printss} isLoading={isLoading}/>
        </div>
        <div className={styles.componentWrapper}>
          <ReactFlowProvider>
            <ChartPage nodes={nodes} edges={edges}  positivemode={positivemode}/>
          </ReactFlowProvider>
        </div>
      </div>
    </>
  );
};

export default Lookpage;
