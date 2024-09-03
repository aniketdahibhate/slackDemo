const { App } = require("@slack/bolt");
const axios = require('axios');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
let globalData={
  userName:' ',
  caseSubject:' '
};
let globalView;//stores global view
app.command('/runflow', async ({ command, ack, respond }) => {
  try {
    await ack();
    const response = await axios.post('https://smtkashibainavlecollegeofe4-dev-ed.my.salesforce.com/services/data/v60.0/actions/custom/flow/SupportFlow', {
      inputs: {
        recordId: '5005j00000xj2JFAAY'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      await respond({ text: 'Salesforce Flow executed successfully!' });
    } else {
      await respond({ text: 'Failed to execute Salesforce Flow.' });
    }
  } catch (error) {
    console.error(error);
    await respond({ text: 'An error occurred while executing the Salesforce Flow.' + error });
  }
});

app.command('/callapex', async ({ command, ack, respond }) => {
  try {
    await ack();
    const response = await axios.post('https://smtkashibainavlecollegeofe4-dev-ed.my.salesforce.com/services/apexrest/invokeScreenFlow', {
      inputs: {
        demoVariable: '5005j00000xj2JFAAY'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      await respond({ text: 'Salesforce Flow executed successfully!' });
    } else {
      await respond({ text: 'Failed to execute Salesforce Flow.' });
    }
  } catch (error) {
    console.error(error);
    await respond({ text: 'An error occurred while executing the Salesforce Flow.' + error });
  }
});
// Function to generate the view
function generateView(blocks) {
  return {
    type: 'modal',
    callback_id: 'first_screen',
    title: {
      type: 'plain_text',
      text: 'Case Create Modal'
    }
    ,
    submit: {
          type: 'plain_text',
          text: 'Next'
         
        },
    blocks: blocks
  
  };
}
//workflow step


// Command to open the modal
app.command('/openmodal', async ({ command, ack, client, logger }) => {
  try {
    // Acknowledge the command request
    await ack();
    let blocks1 = [
    {
  "type": "actions",
  "elements": [
    {
      "type": "static_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Absense Record Type",
        "emoji": true
      },
      "options": [
        {
          "text": {
            "type": "plain_text",
            "text": "Sameday",
            "emoji": true
          },
          "value": "sameday"
        },
        {
          "text": {
            "type": "plain_text",
            "text": "Future",
            "emoji": true
          },
          "value": "future"
        }
      ], // some logic here for option values
      "action_id": "static_select_action"
    }
  ]
} ];
    
    globalView = generateView(blocks1);
    // Open the modal
    const res = await client.views.open({
      trigger_id: command.trigger_id,
      
      view: globalView,
      
    });
   // logger.info(res);
  } catch (error) {
    logger.error(error);
  }
});

//listen to absenese record type event 
app.action('static_select_action', async ({ body, ack, client, logger }) => {
  await ack();
  const selectedType = body.actions[0].selected_option.value;
  logger.info(`Selected Absense type: ${selectedType}`);
  logger.info(` subject: ${globalData.caseSubject}`);
  logger.info(` User: ${globalData.userName}`);
 let blocks1 = [
    {
  "type": "actions",
  "elements": [
    {
      "type": "static_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Absense Record Type",
        "emoji": true
      },
      "options": [
        {
          "text": {
            "type": "plain_text",
            "text": "Sameday",
            "emoji": true
          },
          "value": "sameday"
        },
        {
          "text": {
            "type": "plain_text",
            "text": "Future",
            "emoji": true
          },
          "value": "future"
        }
      ], // some logic here for option values
      "action_id": "static_select_action"
    }
  ]
},
    {
      type: 'input',
      block_id: 'user_Name_Block',
      element: {
        type: 'plain_text_input',
        action_id: 'user_Name_action',
        initial_value:globalData.userName
      },
      label: {
        type: 'plain_text',
        text: 'Enter User Name!'
      }
    },
    {
      type: 'input',
      block_id: 'my_block',
      element: {
        type: 'plain_text_input',
        action_id: 'my_action',
        initial_value:globalData.caseSubject
      },
      label: {
        type: 'plain_text',
        text: 'Enter Case Subject!'
      }
    }
  ];

  if (selectedType === 'sameday') {
    blocks1.push(
      {
        type: 'input',
        block_id: 'start_time_Block',
        element: {
          type: 'datetimepicker',
          action_id: 'startdatetimepicker_action'
        },
        label: {
          type: 'plain_text',
          text: 'Start date',
          emoji: true
        }
      },{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Next",
						"emoji": true
					},
					"value": "dfg",
					"action_id": "nextBtn"
				}
			]
		}
    );
  } else if (selectedType === 'future') {
    blocks1.push(
      {
        type: 'input',
        block_id: 'start_time_Block',
        element: {
          type: 'datetimepicker',
          action_id: 'startdatetimepicker_action'
        },
        label: {
          type: 'plain_text',
          text: 'Start date',
          emoji: true
        }
      },
      {
        type: 'input',
        block_id: 'end_time_Block',
        element: {
          type: 'datetimepicker',
          action_id: 'enddatetimepicker_action'
        },
        label: {
          type: 'plain_text',
          text: 'End date',
          emoji: true
        }
      },{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Next",
						"emoji": true
					},
					"value": "click_me_123",
					"action_id": "nextBtn"
				}
			]
		}
      
    );
  }
globalView = generateView(blocks1);
  try {
    const res = await client.views.update({
      view_id: body.view.id,
      view: {
        type: 'modal',
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: 'Step 1'
        },
        submit: {
          type: 'plain_text',
          text: 'Submit'
        },
        blocks:blocks1
      }
    });
    //logger.info(res);
  } catch (error) {
    logger.error(error);
  }
});
//listen to next button event
app.action('nextBtn', async ({ body, ack, client, logger }) => {
  await ack();
  const selectedButton = body.actions[0].value;
  const subjectinput = body.view.state.values.my_block.my_action.value;
  const userNameInput = body.view.state.values.user_Name_Block.user_Name_action.value;
  globalData.userName = userNameInput;//store in global obj variable
  globalData.caseSubject = subjectinput;//store in global obj variable
  
  logger.info(`Selected type: ${selectedButton}`);
  logger.info(` subject: ${globalData.caseSubject}`);
  logger.info(` User: ${globalData.userName}`);

 let blocks1 = [
    {
      type: 'input',
      block_id: 'nextScreenDescBlock',
      element: {
        type: 'plain_text_input',
        action_id: 'next_Screen_Desc_action'
      },
      label: {
        type: 'plain_text',
        text: 'Enter Description for Absense!'
      }
    },{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Previous",
						"emoji": true
					},
					"value": "pre",
					"action_id": "preBtn"
				}
			]
		},{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Submit",
						"emoji": true
					},
					"value": "submit",
					"action_id": "Submit"
				}
			]
		}
    
  ];

  try {
    const res = await client.views.update({
      view_id: body.view.id,
      view: {
        type: 'modal',
        callback_id: 'gratitude-modal',
        title: {
          type: 'plain_text',
          text: 'Case Create Modal'
        },submit: {
          type: 'plain_text',
          text: 'Submit'
        },
        close: {
          type: 'plain_text',
          text: 'Cancel'
        },
        blocks: blocks1
      }
    });
   // logger.info(res);
  } catch (error) {
    logger.error(error);
  }
});
//listen to preveious button
app.action('preBtn', async ({ body, ack, client, logger }) => {
  await ack();
  logger.info(` pre subject: ${globalData.caseSubject}`);
  logger.info(` pre User: ${globalData.userName}`);
  try {
    const res = await client.views.update({
      view_id: body.view.id,
      view: globalView
    });
   // logger.info(res);
  } catch (error) {
    logger.error(error);
  }
});
app.view('gratitude-modal', async ({ ack, body, view, client, logger }) => {
  
  const user = body.user.id;
  const subjectinput = globalData.caseSubject;//view.state.values.my_block.my_action.value;
  const userNameInput =globalData.userName;// view.state.values.user_Name_Block.user_Name_action.value;
  //const startTime = view.state.values.start_time_Block.startdatetimepicker_action.value;
  //const endTime = view.state.values.end_time_Block.enddatetimepicker_action.value;
  //const absenseType = view.state.values.type_Block.static_select_action.selected_option.value;
  //logger.info(`Input type: ${absenseType}`);
  // Validate the input length
  if (subjectinput.length < 5) {
    await ack({
      response_action: 'errors',
      errors: {
        my_block: 'Input should not be less than 5 characters long.'
      }
    });
    return;// Early return if validation fails
  }
  
  try {
    //await ack();
    const response = await axios.post('https://smtkashibainavlecollegeofe4-dev-ed.my.salesforce.com/services/apexrest/invokeScreenFlow', {
      inputs: {
        demoVariable:subjectinput,
        userName:userNameInput
       // startTime:endTime,
        //endTime:endTime,
        //type:absenseType
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    logger.info(response);
    // Check the validation result
    if (response.data.isValid) {
      await ack();
      // Proceed with further processing if the user ID is valid
      logger.info('User ID is valid.');
    } else {
      await ack({
        response_action: 'errors',
        errors: {
          user_Name_Block: response.data.errorMessage
        }
      });
      return; // Early return if validation fails
    }
    if (response.status === 200) {
      logger.info('success');
    } else {
      logger.info('error');
    }
  } catch (error) {
    console.error(error);
    logger.info('error 1');
  }
  
});
//handle first screen view
app.view('first_screen', async ({ ack, body, view, client, logger }) => {
  await ack();
  const user = body.user.id;
  const subjectinput = body.view.state.values.my_block.my_action.value;
  const userNameInput = body.view.state.values.user_Name_Block.user_Name_action.value;
  globalData.userName = userNameInput;//store in global obj variable
  globalData.caseSubject = subjectinput;//store in global obj variable
  
   try {
    const result = await client.views.open({
     trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'gratitude-modal',
        title: {
          type: 'plain_text',
          text: 'Step 2'
        },
        blocks: [
          {
            type: 'input',
            block_id: 'input_block_2',
            element: {
              type: 'plain_text_input',
              action_id: 'input_action_2'
            },
            label: {
              type: 'plain_text',
              text: 'Input something for step 2'
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
  
  
});
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
