import axios from 'axios';

const createMessage = (strList: string[]) => {
  console.log(strList.at(-2)! + strList.at(-1))
  
  return(
  `
  あなたは[プロのアイデアマン]です。
  段階的に考えてください。

  ### 指示
  1. 以下の行動内容に対して起こりうる可能性を、段階的に考慮してください。
  2. メリットとデメリットの双方をバランスよく、でも少しデメリットを中心に一般的に起きうる可能性が高い物を挙げてください。
  3. 実際にどんな結果が考えられるかを想像し、その後の行動につながるアイデアも提示してください。
  4. 悪い結果だけでなく良い結果も含め、幅広いリスクとリターンを10個まで提示してください。
  5. 出来れば10個出力する時、5個がメリットで5個がデメリットになるようにしてください。

  ### 想定質問する人のレベル
  - 大学生

  ### 今までの行動(参照にしてください。この行動に続く可能性は出力しないでください。)
  ${strList}

  ### 行動内容(なのでに続く可能性を出力してください。)
  - ${strList.at(-1)}


  ### 出力形式
  [
    ["起きる事(1)", "起きる事(2)", "起きる事(3)", …],
    ["点数(1)","点数(2)","点数(3)", …],
    ["理由(1)", "理由(2)", "理由(3)", …]
  ]

  ### ルール
  - 最大10個までの「起きる事」を出力してください。（10個未満でも問題ありません）
  - 「だから」という単語は使わないでください。
  - 出力する点数は0点～100点の範囲とし、良い結果も悪い結果も含めて、評価してください。
    - 0点：最悪の事態で、人生に大きなダメージを与える結果
    - 50点：一般的な結果
    - 100点：極めて幸運な結果
  - 「ので」につながる内容を加えてください。
  - デメリット・リスクも含めた幅広い結果を提示してください。
  - 内部で10回出力を試し、最も自己評価が高い結果のみを最終出力してください。
  - 現実的な可能性を踏まえて回答してください。
  - どんな場合でも、上記の出力形式（3つの配列）を厳守してください。

  ### 入力例
  - 告白に失敗する。なので

  ### 出力例
  [
    ["友達に慰められる","しばらく何もしたくなくなる","一生引きずるような後悔になる",…],
    ["60点","42点","40点",…],
    [
      "友達が慰めてくれて、仲が深まる可能性がある。",
      "何もしたくなくなると、時間を無駄にする恐れがある。",
      "一生引きずると、今後の行動に影響を与え、躊躇してしまう。"
    ]
  ]
    `
  )
}


export const fetchPossibilities = async (inputText: string[]): Promise<string[][]> => {

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FOO}`,
    }
  }

  const data =  {
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": createMessage(inputText)
      }
    ]
  }

  const url = 'https://api.openai.com/v1/chat/completions'

  
  try {
    const response = await axios.post(url, data, config);

    
    
    // APIからのレスポンスをチェックして、文字列かどうか確認
    const content = response.data.choices[0].message.content;

    // もしコンテンツがすでにJSON形式ならパースする
    let possibilities;
    if (typeof content === 'string') {
        try {
            const parsedArray = JSON.parse(content);
            possibilities = parsedArray;
        } catch (error) {
            possibilities = content;
            console.warn(`Response is a plain string, not JSON.${error}`);
        }
    } else {
        possibilities = content;
    }

    return possibilities;

  } catch (error) {
      console.error('Error fetching possibilities:', error);
      return [];
  }
}