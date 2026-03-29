function randomArrayIndexGenerator(arrayLength: number): number {
  return Math.floor(Math.random() * 100) % arrayLength;
}

export default randomArrayIndexGenerator;
