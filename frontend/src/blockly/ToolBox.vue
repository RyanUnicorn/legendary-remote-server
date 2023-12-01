<script setup>
  import * as Blockly from "blockly/core";
  import { onMounted, ref } from 'vue';
  import {javascriptGenerator, Order} from "blockly/javascript";
  import { globals } from '../main';
  import axios from 'axios';

  const props = defineProps([
    'deviceId',
  ]);

  const blocksValue = ref({
    irCodes: {},
    states: {},
    consts: {},
  });

  function upperCase(str){
    return str[0].toUpperCase()+str.slice(1);
  }

  async function fetchBlocks(){
      /**
       * * GET /api/blockly/{deviceId}
       */
      try {
        const result = await axios.get(`${globals.$origin}/api/blockly/${props.deviceId}`);
        blocksValue.value = result.data;
        // console.log(blocksValue.value);
      } catch(err) {
        console.error(err);
      }
  }

  function initBlocks(){
    Blockly.Blocks['send_ir_code'] = {
      init: function() {
        this.appendValueInput("IR_CODE")
            .setCheck("ir_code_id")
            .appendField("Send IR code");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(30);
        this.setTooltip("Send the IR code specified.");
      }
    }

    javascriptGenerator.forBlock['send_ir_code'] = function(block, generator) {
      var value_ir_code = generator.valueToCode(block, 'IR_CODE', javascript.Order.ATOMIC);
      var code = '...\n';
      return code;
    };

    Object.keys(blocksValue.value.irCodes).forEach((key) => {
      Blockly.Blocks[`IR_${key}`] = {
        init: function() {
          this.appendDummyInput()
              .appendField(blocksValue.value.irCodes[key].blockName);
          this.setOutput(true, "ir_code_id");
          this.setColour(30);
          this.setTooltip(blocksValue.value.irCodes[key].blockDescription);
        }
      };

      javascriptGenerator.forBlock[`IR_${key}`] = function(block, generator) {
        var code = '...';
        return [code, Blockly.javascript.ORDER_NONE];
      };
    });

    Object.keys(blocksValue.value.states).forEach((key) => {
      Blockly.Blocks[`State_${key}`] = {
        init: function() {
          this.appendDummyInput()
              .appendField(blocksValue.value.states[key].blockName)
              .appendField(new Blockly.FieldDropdown([["target state","TAR"], ["original state","ORI"]]), "TYPE");
          this.setOutput(true, upperCase(blocksValue.value.states[key].type));
          this.setColour(270);
        }
      };

      javascriptGenerator.forBlock[`State_${key}`] = function(block, generator) {
        var dropdown_type = block.getFieldValue('TYPE');
        var code = '...';
        return [code, Blockly.javascript.ORDER_NONE];
      };
    });

    Object.keys(blocksValue.value.consts).forEach((key) => {
      if(blocksValue.value.consts[key].type == 'array'){
        const dropdown = blocksValue.value.consts[key].const.reduce((arr, element) => {
          arr.push([element, element]);
          return arr;
        }, []);
        console.log(dropdown);
        Blockly.Blocks[`Const_${key}`] = {
          init: function() {
            this.appendDummyInput()
                .appendField(blocksValue.value.consts[key].blockName)
                .appendField(new Blockly.FieldDropdown(dropdown), "OPTION");
            this.setOutput(true, "String");
            this.setColour(150);
          }
        };

        javascriptGenerator.forBlock[`Const_${key}`] = function(block, generator) {
          var dropdown_option = block.getFieldValue('OPTION');
          var code = '...';
          return [code, Blockly.javascript.ORDER_NONE];
        };
      } else {
        Blockly.Blocks[`Const_${key}`] = {
          init: function() {
            this.appendDummyInput()
                .appendField(blocksValue.value.consts[key].blockName);
            this.setOutput(true, upperCase(blocksValue.value.consts[key].type));
            this.setColour(150);
          }
        };

        javascriptGenerator.forBlock[`Const_${key}`] = function(block, generator) {
          var code = '...';
          return [code, Blockly.javascript.ORDER_NONE];
        };
      }
    });
  }

  onMounted(async()=>{
    await fetchBlocks();
    await new Promise((res) => setTimeout(res, 250));
    initBlocks();
  });
</script>

<template>

  <xml xmlns="https://developers.google.com/blockly/xml" id="Default-toolbox" style="display: none">
    <category name="Logic" categorystyle="logic_category">
      <block type="controls_if"></block>
      <block type="logic_compare"></block>
      <block type="logic_operation"></block>
      <block type="logic_negate"></block>
      <block type="logic_boolean"></block>
      <block type="logic_null"></block>
      <block type="logic_ternary"></block>
    </category>
    <category name="Loops" categorystyle="loop_category">
      <block type="controls_repeat_ext">
        <value name="TIMES">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="controls_repeat"></block>
      <block type="controls_whileUntil"></block>
      <block type="controls_for">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <value name="BY">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="controls_forEach"></block>
      <block type="controls_flow_statements"></block>
    </category>
    <category name="Math" categorystyle="math_category">
      <block type="math_number" gap="32">
        <field name="NUM">123</field>
      </block>
      <block type="math_arithmetic">
        <value name="A">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="B">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="math_single">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">9</field>
          </shadow>
        </value>
      </block>
      <block type="math_trig">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">45</field>
          </shadow>
        </value>
      </block>
      <block type="math_constant"></block>
      <block type="math_number_property">
        <value name="NUMBER_TO_CHECK">
          <shadow type="math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
      </block>
      <block type="math_round">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">3.1</field>
          </shadow>
        </value>
      </block>
      <block type="math_on_list"></block>
      <block type="math_modulo">
        <value name="DIVIDEND">
          <shadow type="math_number">
            <field name="NUM">64</field>
          </shadow>
        </value>
        <value name="DIVISOR">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="math_constrain">
        <value name="VALUE">
          <shadow type="math_number">
            <field name="NUM">50</field>
          </shadow>
        </value>
        <value name="LOW">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="HIGH">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <block type="math_random_int">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <block type="math_random_float"></block>
      <block type="math_atan2">
        <value name="X">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="Y">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
    </category>
    <sep></sep>
    <category name="Variables" categorystyle="variable_category" custom="VARIABLE"></category>
    <sep></sep>
    <category name="IR" colour="30">
      <block type="send_ir_code"></block>
      <block v-for="key in Object.keys(blocksValue.irCodes)" :type="`IR_${key}`"></block>
    </category>
    <category name="State" colour="270">
      <block v-for="key in Object.keys(blocksValue.states)" :type="`State_${key}`"></block>
    </category>
    <category name="Const" colour="150">
      <block v-for="key in Object.keys(blocksValue.consts)" :type="`Const_${key}`"></block>
    </category>
  </xml>

</template>