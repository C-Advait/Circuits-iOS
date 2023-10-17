export default Object.freeze({
  INIT: "INIT_FROM_PARAMS",
  SET_ACTIVE_KEY: "SET_ACTIVE_KEY",
  SET_WORK_TIME: "SET_WORK_TIME",
  SET_REST: "SET_REST",
  SET_BREAK: "SET_BREAK",
  SET_ROUNDS: "SET_ROUNDS",
  SET_TITLE: "SET_TITLE",
  SET_PREVIOUS: "SET_PREVIOUS",
  REVERT_PREVIOUS: "REVERT_PREVIOUS",
  FLAG_DIRTY: "FLAG_DIRTY",
  TOGGLE_APPLY_FLAG: "TOGGLE_APPLY_FLAG",
});

// <View style={styles.tile}>
//   <Text style={{ color: "white" }}>Rounds</Text>
//   <Text
//     style={{ color: "white" }}
//     onPress={() => {
//       dispatch({
//         type: exerciseEditActions.SET_ACTIVE_KEY,
//         key: MODAL_CONTENT_ENUM.ROUNDS.key
//       })
//       dispatch({ type: exerciseEditActions.SET_PREVIOUS })
//       setContentType(MODAL_CONTENT_ENUM.ROUNDS);
//       modalRef.current?.expand();
//     }}>{state.numberOfRounds}</Text>
// </View>

// onChange={(isOpen) => onChange(isOpen)}

// <AuxilaryCard
//   editable={false}
//   bold={false}
//   title={"Name"}
//   InputComponent={() => (
//     <EditableText
//       exercise={exercise}
//       onSubmit={(text) => {
//         updateTitle(text);
//         setInfoChanged(true);
//       }}
//     />
//   )}
// />
// <AuxilaryCard
//   editable={false}
//   bold={false}
//   title={"Work time"}
//   InputComponent={() => {
//     const [startingMinute, startingSecond] = extractStartingPickerTime(
//       originalExercise,
//       "workTime",
//     );

//     return (
//       <TimePickerModal
//         promptTitle="Work time"
//         promptSubtitle="Duration of the work round."
//         startingMinute={startingMinute}
//         startingSecond={startingSecond}
//         onSubmit={(minutes, seconds) => {
//           handleWorkTimeUpdate(minutes, seconds);
//         }}
//       />
//     );
//   }}
// />
// <AuxilaryCard
//   editable={false}
//   bold={false}
//   title={"Number of rounds"}
//   InputComponent={() => (
//     <NumberPickerModal
//       promptTitle="Number of rounds"
//       promptSubtitle="Repetitions of the current exercise."
//       startingNumber={extractStartingRounds(originalExercise)}
//       state={state}
//       dispatch={dispatch}
//     />
//   )}
// />
// <AuxilaryCard
//   editable={false}
//   bold={false}
//   title={"Rest between rounds"}
//   InputComponent={() => {
//     const [startingMinute, startingSecond] = extractStartingPickerTime(
//       originalExercise,
//       "restBetweenRounds",
//       " 0",
//       "30",
//     );

//     return (
//       <Receiver>
//         <TimePickerModal
//           promptTitle="Rest"
//           promptSubtitle="Duration of rest between subsequent rounds."
//           startingMinute={startingMinute}
//           startingSecond={startingSecond}
//           enabled={parseInt(extractStartingRounds(originalExercise)) > 1}
//         />
//       </Receiver>
//     );
//   }}
// />
// <AuxilaryCard
//   editable={false}
//   bold={false}
//   title={"Break until next exercise"}
//   InputComponent={() => {
//     const [startingMinute, startingSecond] = extractStartingPickerTime(
//       originalExercise,
//       "breakBeforeNext",
//       " 0",
//       "30",
//     );

//     return (
//       <TimePickerModal
//         promptTitle="Break"
//         promptSubtitle="Duration of break before next exercise."
//         startingMinute={startingMinute}
//         startingSecond={startingSecond}
//       />
//     );
//   }}
// />
