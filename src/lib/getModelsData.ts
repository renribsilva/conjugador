import allVerbsData from '../json/allVerbs.json'
import modelsData from '../json/models.json'
import groupedModelsData from '../json/groupedModels.json'

export function getModelsData (verb: string) {

  const modelNumbers = allVerbsData[verb]?.model || [];
  const accumulatedData: Record<string, any[]> = {};

  modelNumbers.forEach((num: number) => {
    const model = modelsData[num];
    const verbKey = model?.ref?.[0];
    const totalKey = model?.total?.[0];
    const groupKey = model?.group?.[0];
    const groupDescription = groupedModelsData[groupKey]?.[0];

    if (!accumulatedData.modelNumber) accumulatedData.modelNumber = [];
    if (!accumulatedData.verbRef) accumulatedData.verbRef = [];
    if (!accumulatedData.total) accumulatedData.total = [];
    if (!accumulatedData.group) accumulatedData.group = [];
    if (!accumulatedData.groupDescription) accumulatedData.groupDescription = [];

    accumulatedData.modelNumber.push(num);
    if (verbKey) accumulatedData.verbRef.push(verbKey);
    if (totalKey) accumulatedData.total.push(totalKey);
    if (groupKey) accumulatedData.group.push(groupKey);
    if (groupDescription) accumulatedData.groupDescription.push(groupDescription);
  });

  // console.log(accumulatedData);
  return accumulatedData

}