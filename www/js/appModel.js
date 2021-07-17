/*******************************************************************
 * Chart
 *******************************************************************/

export class Chart {
    constructor (id, name, key = 0, mpr = 3) {
        this.name = name;
        this.id = id;
        this.measures = [];
        this.lines = [];
        this.key = key;
        this.toolChords = [];
        this.measuresPerRow = mpr;
    }

    exportChart() {

    }
    
    deleteMeasure(measureId) {
        
    }

    addMeasure(id, bpm, pageBreak = false) {
        let newMeasure = new Measure(id, bpm, pageBreak);
        this.measures.push(newMeasure);
       
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

    getKeyName() {
           
       switch (+this.key) {
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

    setName(newName){
        this.name = newName;
    }

}

/*******************************************************************
 * Measure
 *******************************************************************/

export class Measure {
    constructor (id, beats, isPageBreak = false) {
        this.id = id;
        this.chords = [];
        this.lyrics = [];
        this.beats = beats;
        this.isPageBreak = isPageBreak;
        this.isMeasure = true;
    }

    getChords() {
        return this.chords;
    }

    addLyric(newLyric, index) {

        this.lyrics[index] = newLyric;

    }

    setBeats(newBeats) {
        this.beats = newBeats;
    }

    getBeats() {
        return this.beats;
    }


}

/*******************************************************************
 * Chord
 *******************************************************************/

export class Chord {
    constructor (id, tone, type, isToolBarChord = false){
        this.id = id;
        this.tone = tone * 1;
        this.type = type;
        this.isToolBarChord = isToolBarChord;
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

    getChordName() {
        let chordName = this.getToneName() + this.type;

        return chordName;
    }

    getToneName () {
        
       
        switch (+this.tone) {
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

        switch(+tonic) {
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
            
            switch(+subdominant) {
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

        switch(+tonic) {
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
            
            switch(+dominant) {
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
        
        
        switch(+newKey) {
            case 0:
            case 101:
            case 103:
            case 5:
            case 106:
            case 108:
            case 110:
                isFlat = true;
            break;
            default:
                isFlat = false;
            break;
        }
     
        if (oldKey > 100){
            oldKey -= 100;
        }

        if (newKey > 100){
            isFlat = true;
            newKey -= 100;
        }
       
        let shift = (12 + newKey - oldKey) % 12;

        let newTone = 0;

        if(this.tone > 100) {
            newTone = (this.tone + shift - 100) % 12;
        } 
        else {
            newTone = (this.tone + shift) % 12;
        }     

        let isEnharmonicEquivilant = false;
        switch (+newTone){
            case 1:
            case 3:
            case 6:
            case 8:
            case 10:
                isEnharmonicEquivilant = true;
                break;
            default:
                isEnharmonicEquivilant = false;
        }

        if (isFlat == true && isEnharmonicEquivilant == true) {
            newTone += 100;
        }

        this.tone = newTone;
       
    }
}

