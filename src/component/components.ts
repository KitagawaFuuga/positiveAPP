export const extractScore = (text: string): number => {
  const match = text.match(/\d+/); // 数字の部分を抽出
  return match ? parseInt(match[0], 10) : 0; // 見つかれば数値に変換、見つからなければ 0
};

export const extractTextWithoutScore = (text: string): string => {
  return text.replace(/\d+点/, '').trim(); // 「○○ 50点」形式の点数部分を除去
};

// 点数に応じて背景色を決定する関数 (透明度を追加)
// グラデーション用の関数を修正
export const getColorByScore = (score: number) => {
  if (score === null || score === undefined) {
    return 'rgba(227, 242, 253, 0.3)'; // デフォルトの色
  }

  // スコアが低い場合は紫、高い場合は緑へグラデーションする
  const green = Math.min(255, Math.max(0, Math.floor(score * 2)));         // 緑の強さを調整
  const blue = Math.min(255, Math.max(0, Math.floor(255 - (score * 2))));  // 青を追加して紫に調整

  // 通常のグラデーション（紫から緑への変化）
  return `rgba(0, ${green}, ${blue}, 0.5)`;  // 紫から緑のグラデーション
};



export const replaceText = (text: string): string => {
  return text.replace("。なので","")
}

export type PossibilityData = {
  possibilities: string[];
  scores: string[];
  reasons: string[];
};

export interface NodeDataType {
  label: string;
}

export interface PrintScreenProps {
  input: string;
  firstinput: string;
  count: number;
  positivemode: boolean;
  handlePossibilityClick: (possibility: string, index: number) => void;
  handleBackClick: () => void;
  handlepositiveClick: (deletenum: number) => void;
  getAllPossibilitiesLog: Map<string, PossibilityData>;
  getAllPossibilities: Map<number, PossibilityData>;
  getPossibilities: string[];
}

export function sortBySecondRow(arr: string[][]): string[][] {
  const indices = arr[1]
    .map((value, index) => ({ value: extractScore(value), index })) // extractScoreで数値を取得
    .sort((a, b) => b.value - a.value) // 降順でソート（昇順なら a.value - b.value）
    .map(obj => obj.index); // ソート後のインデックスを取得

  // ソートされたインデックスを使って新しい配列を作成
  return arr.map(row => indices.map(i => row[i]));
}

export const sortByScorelessthan50 = (arr: string[][]): string[][] => {
  const indices = arr[1]
    .map((value, index) => ({ value: extractScore(value), index })) // extractScoreで数値を取得
    .filter((value) => value.value > 50)
    .map(obj => obj.index); // ソート後のインデックスを取得

  // ソートされたインデックスを使って新しい配列を作成
  return arr.map(row => indices.map(i => row[i]));
}
