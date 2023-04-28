import { loadSync } from "https://deno.land/std@0.184.0/dotenv/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v0.25.7/ansi/colors.ts";

import { relativePath } from "./relativePath.ts";
import { SubmitData } from "./createSubmit.ts";

const configData = loadSync({ envPath: relativePath("../.env") });

const { TOKEN, PROJECT_NUMBER, ENTERPRISE_ID, SAVE_URL, SUBMIT_URL } =
  configData;

if (!TOKEN) {
  throw new Error("TOKEN is not set");
}

if (!PROJECT_NUMBER) {
  throw new Error("PROJECT_NUMBER is not set");
}

if (!ENTERPRISE_ID) {
  throw new Error("ENTERPRISE_ID is not set");
}

if (!SAVE_URL) {
  throw new Error("SAVE_URL is not set");
}

if (!SUBMIT_URL) {
  throw new Error("SUBMIT_URL is not set");
}

const formatSubmitDate = (date: Date): string => {
  return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
};

const createSubmitPayload = (data: SubmitData, endDate: Date) => {
  return {
    enterpriseId: ENTERPRISE_ID,
    messageID: null,
    periodEnd: formatSubmitDate(endDate),
    transactionId: null,
    sourceSystem: null,
    tasks: [
      {
        assignment: {
          projectNumber: PROJECT_NUMBER,
          projectDescription: null,
          projectType: null,
          isFederalProject: null,
          hasError: null,
          tooltip: null,
          isReadOnly: null,
          hasAdjustment: null,
          hasNetWorks: null,
          hasCostCollectors: null,
          hasDismissCheckboxChecked: null,
          hasInvalidStaticProject: null,
          hasSuspenseExpenseProject: null,
          masterServicesAgreement: null,
          isValid: null,
          treeValidationError: null,
          treeNetworkHierarchy: null,
          isLeaf: null,
          isHolidayProj: null,
        },
        validationRule: null,
        sequenceNumber: 1,
        timeEntries: data.map(({ date, hours }) => ({
          date: formatSubmitDate(date),
          hours,
          hasError: null,
          hasAdjustment: null,
          tooltip: null,
          dayOfWeek: null,
          isShowErrorInTotalHour: null,
          isPolicy818: null,
          isMalaysiaValidation: null,
          isGDNValidation: null,
          isInvalidForUSFed: null,
          errorType: null,
          source: null,
        })),
        allowOverTime: null,
        allowOtherProjects: null,
        allowOtherStaticProjects: null,
        totalDailyMax: null,
        isReadOnly: null,
        isDeletable: null,
        status: null,
        tooltip: null,
      },
    ],
    savePunchClockEntriesInput: null,
    isSubmit: null,
    isFromLocation: null,
  };
};

export const syncSubmit = async (data: SubmitData, endDate: Date) => {
  const payload = createSubmitPayload(data, endDate);

  const response = await fetch(SAVE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      authorization: TOKEN,
      "content-type": "application/json-patch+json",
    },
  });

  if (response.ok) {
    const msg = colors.green(`Saved SubmitData. Submit it here: ${SUBMIT_URL}`);

    console.info(msg);
    return true;
  }

  const msg = colors.red("Failed to save submit.");
  console.info(msg);

  console.info(`StatusCode: ${response.status}`);
  console.info(`StatusText: ${response.statusText}`);

  return false;
};
