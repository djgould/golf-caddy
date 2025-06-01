import React from 'react';
import { View, Text, ScrollView } from 'react-native';

interface HoleScore {
  hole: number;
  par: number;
  score: number;
  putts?: number;
  fairway?: boolean;
  gir?: boolean; // Green in Regulation
}

interface ScoreCardProps {
  playerName: string;
  courseName: string;
  date: Date;
  holes: HoleScore[];
  className?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  playerName,
  courseName,
  date,
  holes,
  className = '',
}) => {
  const front9 = holes.slice(0, 9);
  const back9 = holes.slice(9, 18);

  const calculateTotals = (holeSet: HoleScore[]) => {
    const totalPar = holeSet.reduce((sum, hole) => sum + hole.par, 0);
    const totalScore = holeSet.reduce((sum, hole) => sum + (hole.score || hole.par), 0);
    const totalPutts = holeSet.reduce((sum, hole) => sum + (hole.putts || 0), 0);
    return { totalPar, totalScore, totalPutts };
  };

  const front9Totals = calculateTotals(front9);
  const back9Totals = calculateTotals(back9);
  const totalPar = front9Totals.totalPar + back9Totals.totalPar;
  const totalScore = front9Totals.totalScore + back9Totals.totalScore;
  const totalPutts = front9Totals.totalPutts + back9Totals.totalPutts;
  const totalDiff = totalScore - totalPar;

  const getScoreColor = (score: number, par: number) => {
    if (!score) return 'text-gray-400';
    const diff = score - par;
    if (diff <= -2) return 'text-red-600 font-bold'; // Eagle or better
    if (diff === -1) return 'text-red-500'; // Birdie
    if (diff === 0) return 'text-green-600'; // Par
    if (diff === 1) return 'text-yellow-600'; // Bogey
    return 'text-orange-600'; // Double bogey or worse
  };

  const getScoreDiffText = (diff: number) => {
    if (diff === 0) return 'E';
    return diff > 0 ? `+${diff}` : `${diff}`;
  };

  const renderHoleRow = (hole: HoleScore, index: number) => (
    <View key={hole.hole} className="flex-row items-center border-b border-gray-200 py-2">
      <Text className="w-8 text-center text-xs text-gray-600">{hole.hole}</Text>
      <Text className="w-8 text-center text-xs text-gray-500">{hole.par}</Text>
      <Text className={`w-8 text-center text-sm ${getScoreColor(hole.score, hole.par)}`}>
        {hole.score || '-'}
      </Text>
      {hole.putts !== undefined && (
        <Text className="w-8 text-center text-xs text-gray-600">{hole.putts}</Text>
      )}
      {hole.fairway !== undefined && (
        <View className="w-8 items-center">
          <View
            className={`w-3 h-3 rounded-full ${hole.fairway ? 'bg-green-500' : 'bg-red-500'}`}
          />
        </View>
      )}
      {hole.gir !== undefined && (
        <View className="w-8 items-center">
          <View className={`w-3 h-3 rounded-full ${hole.gir ? 'bg-green-500' : 'bg-gray-300'}`} />
        </View>
      )}
    </View>
  );

  return (
    <ScrollView className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">{playerName}</Text>
        <Text className="text-sm text-gray-600">{courseName}</Text>
        <Text className="text-xs text-gray-500">
          {date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Score Summary */}
      <View className="p-4 bg-gray-50 border-b border-gray-200">
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-3xl font-bold text-gray-800">{totalScore}</Text>
            <Text
              className={`text-lg font-semibold ${
                totalDiff < 0
                  ? 'text-red-600'
                  : totalDiff === 0
                    ? 'text-green-600'
                    : 'text-orange-600'
              }`}
            >
              {getScoreDiffText(totalDiff)}
            </Text>
            <Text className="text-xs text-gray-500">Total Score</Text>
          </View>
          {totalPutts > 0 && (
            <View className="items-center">
              <Text className="text-3xl font-bold text-gray-800">{totalPutts}</Text>
              <Text className="text-xs text-gray-500">Total Putts</Text>
            </View>
          )}
        </View>
      </View>

      {/* Scorecard Table */}
      <View className="p-2">
        {/* Header Row */}
        <View className="flex-row items-center border-b-2 border-gray-300 pb-2 mb-1">
          <Text className="w-8 text-center text-xs font-semibold text-gray-700">H</Text>
          <Text className="w-8 text-center text-xs font-semibold text-gray-700">Par</Text>
          <Text className="w-8 text-center text-xs font-semibold text-gray-700">Score</Text>
          {holes[0]?.putts !== undefined && (
            <Text className="w-8 text-center text-xs font-semibold text-gray-700">Putts</Text>
          )}
          {holes[0]?.fairway !== undefined && (
            <Text className="w-8 text-center text-xs font-semibold text-gray-700">FW</Text>
          )}
          {holes[0]?.gir !== undefined && (
            <Text className="w-8 text-center text-xs font-semibold text-gray-700">GIR</Text>
          )}
        </View>

        {/* Front 9 */}
        <Text className="text-xs font-semibold text-gray-600 mt-2 mb-1">Front 9</Text>
        {front9.map((hole, index) => renderHoleRow(hole, index))}

        {/* Front 9 Total */}
        <View className="flex-row items-center border-t-2 border-gray-300 pt-2 mb-4">
          <Text className="w-8 text-center text-xs font-semibold text-gray-700">OUT</Text>
          <Text className="w-8 text-center text-xs font-semibold text-gray-700">
            {front9Totals.totalPar}
          </Text>
          <Text className="w-8 text-center text-sm font-bold text-gray-800">
            {front9Totals.totalScore}
          </Text>
          {holes[0]?.putts !== undefined && (
            <Text className="w-8 text-center text-xs font-semibold text-gray-700">
              {front9Totals.totalPutts}
            </Text>
          )}
        </View>

        {/* Back 9 */}
        <Text className="text-xs font-semibold text-gray-600 mb-1">Back 9</Text>
        {back9.map((hole, index) => renderHoleRow(hole, index))}

        {/* Back 9 Total */}
        <View className="flex-row items-center border-t-2 border-gray-300 pt-2 mb-2">
          <Text className="w-8 text-center text-xs font-semibold text-gray-700">IN</Text>
          <Text className="w-8 text-center text-xs font-semibold text-gray-700">
            {back9Totals.totalPar}
          </Text>
          <Text className="w-8 text-center text-sm font-bold text-gray-800">
            {back9Totals.totalScore}
          </Text>
          {holes[0]?.putts !== undefined && (
            <Text className="w-8 text-center text-xs font-semibold text-gray-700">
              {back9Totals.totalPutts}
            </Text>
          )}
        </View>

        {/* Overall Total */}
        <View className="flex-row items-center border-t-2 border-gray-400 pt-2">
          <Text className="w-8 text-center text-sm font-bold text-gray-800">TOT</Text>
          <Text className="w-8 text-center text-sm font-bold text-gray-800">{totalPar}</Text>
          <Text
            className={`w-8 text-center text-base font-bold ${
              totalDiff < 0
                ? 'text-red-600'
                : totalDiff === 0
                  ? 'text-green-600'
                  : 'text-orange-600'
            }`}
          >
            {totalScore}
          </Text>
          {holes[0]?.putts !== undefined && (
            <Text className="w-8 text-center text-sm font-bold text-gray-800">{totalPutts}</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
