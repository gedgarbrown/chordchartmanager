export class Chart {
    constructor (id, name) {
        this.name = name;
        this.id = id;
        this.measures = [];
        this.lines = [];

    }

    exportChart() {

    }
    
    deleteMeasure(measureId) {

    }

    addMeasure() {

    }

    moveMeasure() {

    }

    changeKey(newKey) {

    }

    saveChart() {

    }

    loadChart() {

    }

    importLyrics() {

    }

    exportChart(){

    }

}

export class Measure {
    constructor (id, beats, isPageBreak) {
        this.id = id;
        this. chords = [];
        this.beats = beats;
        this.isPageBreak = isPageBreak;
    }

    getChords() {
        return this.chords;
    }

    addChord(newChord) {

    }

    moveChord(movedChord) {

    }

    addLyric(newLyric) {

    }

    moveLyric(movedLyric) {

    }

    setBeats(newBeats) {
        this.beats = newBeats;
    }

    getBeats() {
        return this.beats;
    }


}

export class Chord {
    constructor (id, tone, type){
        this.id = id;
        this.tone = tone;
        this.type = type;
    }

    setTone(newTone) {
        this.tone = newTone;
    }

    getTone() {
        return this.tone;
    }

    setType(newType) {
        this.type = newType;
    }

    getType() {
        return this.type;
    }
}

