export class Chart {
    constructor (id, name, key = 0) {
        this.name = name;
        this.id = id;
        this.measures = [];
        this.lines = [];
        this.key;
        this.toolChords = [];
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

    setKey(key = 0) {

        key = parseInt(key);

        if (isNaN(key)){
            return;
        };

        this.key = key;
    }

    getKey() {
        return this.key;
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
        this.tone = tone * 1;
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

    getToneName () {
        
        console.log("getting tone name for: ", this.tone);
        switch (this.tone) {
            case 11:
                return "B";
            case 110:
                return "B♭";  
                    
           case 10:
              return "A♯";
    
            case 9:
                return "A";
    
            case 108:
                return "A♭";
    
            case 8:
                return "G♯";
    
            case 7:
                return "G";
    
            case 106:
                return "G♭";
    
            case 6:
                return "F♯";
    
            case 5:
                return "F";
              
            case 4:
                return "E";
    
            case 103:
                return "E♭";
    
            case 3:
                return "D♯";
              
            case 2:
                return "D";
    
            case 101:
                return "D♭";
            
            case 1:
                return "C♯";
        
            case 0:
                return "C";
    
            default:
              return 'C';
          }
          
          return 'C';
    
    }

    getSubdominant(tonic = this.tone) {

        let key = this.tone;
        let isFlat = false;

        if (this.tone > 100) {
            key = this.tone - 100;   
            isFlat = true;
        }

        switch(tonic) {
            case 1:
            case 3:
            case 6:
            case 8:
            case 10:
                isflat = true;
            break;
            default:
            break;
        }
       
        let subdominant = (key + 5) % 12;

        if (isFlat) {
            
            switch(subdominant) {
                case 1:
                case 3:
                case 6:
                case 8:
                case 10:
                    subdominant += 100;
                break;

                default:
                break;
            }
        }
        
        return subdominant;
    }

    getDominant(tonic = this.tone) {

        let key = this.tone;
        let isFlat = false;

        if (this.tone > 100) {
            key = this.tone - 100;   
            isFlat = true;
        }

        switch(tonic) {
            case 1:
            case 3:
            case 6:
            case 8:
            case 10:
                isflat = true;
            break;
            default:
            break;
        }

        let dominant = (key + 7) % 12;
        if (isFlat) {
            
            switch(dominant) {
                case 1:
                case 3:
                case 6:
                case 8:
                case 10:
                    dominant += 100;
                break;

                default:
                break;
            }
            
        }
        
        return dominant;
    }

    transposeKey(oldKey, newKey) {
        let isFlat = false;
        let shift = 0;
        console.log("variables for TransposeKey:");
       
        console.log("oldKey: ", oldKey);
        console.log("newKey: ", newKey);

        if (oldKey > 100){
            oldKey =- 100;
        }

        if (newKey > 100){
            isFlat = true;
            newKey -= 100;
        }
        console.log("newKey", newKey);

        if (oldKey > newKey) {
            shift = 12 - (oldKey - newKey);
        }
        else {
            shift = newKey - oldKey;
        }

        console.log("shift: ", shift);

        let newTone = (this.tone + shift) % 12;


        switch(newKey) {
            case 1:
            case 3:
            case 5:
            case 6:
            case 8:
            case 10:
                isFlat = true;
            break;
            default:

            break;
        }

        console.log("isFlat: ", isFlat);

        if (isFlat) {
            newTone += 100;
        }

        this.tone = newTone;
        
    }
}

