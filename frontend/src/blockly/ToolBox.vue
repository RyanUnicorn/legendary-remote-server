<script>
  import * as Blockly from "blockly/core";
  import {javascriptGenerator, Order} from "blockly/javascript";

  Blockly.Blocks["Example 1"] = {
    init: function () {
      this.appendValueInput("Number")
        .setCheck("Number")
        .appendField("Buy Stock ID")
        .appendField(new Blockly.FieldNumber(0), "ID")
        .appendField("For amount")
        .appendField(new Blockly.FieldNumber(0), "Amount")
        .appendField("At Price")
        .appendField(new Blockly.FieldNumber(0), "Price");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, "String");
      this.setColour(230);
      this.setTooltip("buy id");
      this.setHelpUrl("https://example.com");
    },
  };

  javascriptGenerator.forBlock["Example 1"] = function (block, generator) {
    const numberId = block.getFieldValue("ID");
    const numberAmount = block.getFieldValue("Amount");
    const numberPrice = block.getFieldValue("Price");
    const valueNumber = generator.valueToCode(block, "Number", Order.ATOMIC);
    const code = `buy(${numberId},${numberAmount},${numberPrice},${valueNumber});\n`;
    return code;
  };

  Blockly.Blocks["Example 2"] = {
    init: function () {
      this.appendValueInput("Number")
        .setCheck("Number")
        .appendField("Buy Stock ID");
      this.appendValueInput("NAME").setCheck("Number").appendField("For amount");
      this.appendValueInput("NAME").setCheck("Number").appendField("At Price");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, "String");
      this.setColour(230);
      this.setTooltip("buy id");
      this.setHelpUrl("https://example.com");
    },
  };

  javascriptGenerator.forBlock["Example 2"] = function (block, generator) {
    const valueNumber = generator.valueToCode(block, "Number", Order.ATOMIC);
    const valueName = generator.valueToCode(block, "NAME", Order.ATOMIC);
    const code = `buy(${valueNumber},${valueName},${valueName});\n`;
    return code;
  };

  Blockly.Blocks["Example 3"] = {
    init: function () {
      this.appendValueInput("Fetch")
        .setCheck("Number")
        .appendField("Fetch Price of Stock ID:");
      this.appendDummyInput()
        .appendField("And set to:")
        .appendField(new Blockly.FieldVariable("item"), "variable");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("fetch stock price");
      this.setHelpUrl("https://example.com");
    },
  };

  javascriptGenerator.forBlock["Example 3"] = function (
    block,
    generator
  ) {
    const valueFetch = generator.valueToCode(block, "Fetch", Order.ATOMIC);
    const variableVariable = generator.nameDB_.getName(
      block.getFieldValue("variable"),
      Blockly.names.NameType.VARIABLE
    );
    const code = `fetch_price(${valueFetch},${variableVariable});\n`;
    return code;
  };
</script>

<template>

  <xml id="toolbox-example1" style="display:none;">
    <category name="Math" colour="230">
      <block type="math_number"></block>
      <block type="math_arithmetic"></block>
    </category>
    <category name="Examples" colour="120">
      <block type="Example 1"></block>
      <block type="Example 2"></block>
      <block type="Example 3"></block>
    </category>
  </xml>

  <xml id="toolbox-example2" style="display:none;">
    <category name="Math" colour="230">
      <block type="math_number"></block>
      <block type="math_arithmetic"></block>
    </category>
  </xml>

</template>