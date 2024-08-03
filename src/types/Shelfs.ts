interface DispatchCallBackConsumer {
  // Define properties of DispatchCallBackConsumer if needed
}

interface TaskItem {
  demandId: string;
  demandTime: number;
  arriveTime?: number | null;
  needSide?: string | null;
  hodScore?: number | null;
  estimateOperationTime?: number | null;
  bizCode: string;
  bizDetailCode: string;
  hodCode: string;
  stopPointCode: string;
  isConsumed: boolean;
  isDeliverBack: boolean;
  bizType?: string | null;
  batchCode?: string | null;
  isLastDemand: boolean;
  demandType: string;
  batchProcessMode: boolean;
  dispatchCallBackPhase: string;
  dispatchCallBackConsumer: DispatchCallBackConsumer;
}

interface TaskRecord {
  sendRequestId: string;
  taskId: number;
  sendTime: number;
  returnCode: number;
  arrivedTime?: number | null;
  arrivedShelfSide?: string | null;
  submitToBizTime?: number | null;
  submitToBizTimes?: number[] | null;
  arrivedRequestIds: string[];
}

interface Demand {
  id: string;
  priority: number;
  businessSequence?: number | null;
  estimateOperationSeconds?: number | null;
  destAreaId?: string | null;
  destCellCode?: string | null;
  destRobotFork?: string | null;
  bizCodes?: string[] | null;
  bizIsFinish: boolean;
  batchCode?: string | null;
  isLastDemand: boolean;
  isBatchDispatch: boolean;
  taskId: number;
  isContinue?: boolean | null;
  boxOrder?: string | null;
  robotLayer?: string | null;
  isRiseBoard: boolean;
  latticeCode?: string | null;
  hasBox: boolean;
  needCallBack: boolean;
  directBack: boolean;
  isComing: boolean;
  swapHodCode?: string | null;
  siteCode: string;
  stopPointGroupKey?: string | null;
  stopPointCode: string;
  hodCode: string;
  hodCodes?: string[] | null;
  pairHodCodes?: string[] | null;
  hodSide?: string | null;
  hodEnterInSide?: string | null;
  needSides?: string[] | null;
  isSendRobotTask: boolean;
  isStopTask: boolean;
  taskType?: string | null;
  dispatchType: string;
  hodUseType?: string | null;
  externalSourceStationType?: string | null;
  demandType: string;
  bizDesignatedDemand: boolean;
  reqStopPointCodes?: string[] | null;
  sameDemandDefine: string;
  isForceBack: boolean;
  shelfScore?: number | null;
  bizType?: string | null;
  parkIds: number[];
  actualBoxCode?: string | null;
  latticeCodeList?: string[] | null;
  rackShelfInfos?: any[] | null;
  transferBoxInfos?: any[] | null;
  allowChangeShelfPlacement?: boolean | null;
  cancelManualExc?: boolean | null;
  checkConsumed: boolean;
  relatedTaskIds?: string[] | null;
  unionStationId?: string | null;
  isUnionStation?: boolean | null;
  rectifiedHodSide?: string | null;
  batchProcessMode?: string | null;
  designateDestinationMap?: any[] | null;
  notCancelItemTask: boolean;
  isReSendNewTask: boolean;
  removeBox: boolean;
  addBox: boolean;
  emptyBox: boolean;
}

export interface IDemandObject {
  demandId: string;
  taskId: number;
  siteCode: string;
  stopPointCode: string;
  stopPointGroupKey?: string | null;
  bizCodes?: string[] | null;
  hodCode: string;
  pairHodCodes?: string[] | null;
  swapHodCode?: string | null;
  estimateOperationSeconds?: number | null;
  priority: number;
  businessSequence: number;
  boxOrder?: string | null;
  robotLayer?: string | null;
  isRiseBoard: boolean;
  latticeCode?: string | null;
  hodSides: (string | null)[];
  destAreaId?: string | null;
  demandTime: number;
  sentTime: number;
  returnTime?: number | null;
  arrivedTime?: number | null;
  sendReturnCode: number;
  arrivedHodSide?: string | null;
  submitTime?: number | null;
  isInQueue?: boolean | null;
  hodUseType?: string | null;
  demandType: string;
  dispatchType: string;
  taskItems: TaskItem[];
  taskRecords: TaskRecord[];
  isComing: boolean;
  pickingFetchedBox?: any | null;
  pickingReturnedBox?: any | null;
  putAwayArrivedTime?: number | null;
  putAwayOnSite?: boolean | null;
  putAwayCancel?: boolean | null;
  putAwayAvailableCount?: number | null;
  putAwayTotalAvailableCount: number;
  putAwayForceBack: boolean;
  putAwayFetchedBox?: any | null;
  putAwayReturnedBox?: any | null;
  putAwayLastFetchedTime?: number | null;
  isArrived: boolean;
  taskCanceled: boolean;
  haveSendBack: boolean;
  bizPrimaryUuid?: string | null;
  needReSendNewTask: boolean;
  parkIds: number[];
  demand: Demand;
}

export interface IDemandApiResponse {
  code: number;
  msg: string;
  data: IDemandObject[];
  succ: boolean;
}
