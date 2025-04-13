"use server"
const prodBaseUrl = 'http://10.0.26.164'
const uatBaseUrl = 'http://10.0.25.164'
export async function deleteCase(caseNumber: string, caseType: string, productionLevel: string): Promise<number | null> {
    let url;
    if (!caseNumber || !caseType || !productionLevel) {
        console.error('Invalid input parameters:', { caseNumber, caseType, productionLevel });
        return null;
    }else if(caseType == 'student-teacher'){
        if(productionLevel == 'production'){
            url = `${prodBaseUrl}:7072/trls-72/student-teacher/${caseNumber}`;
        }else if(productionLevel == 'uat'){
            url = `${uatBaseUrl}:7072/trls-72/student-teacher/${caseNumber}`;
        }
    }else if(caseType == 'teacher'){
        if(productionLevel == 'production'){
            url = `${prodBaseUrl}:8080/trls-80/teacher_registrations/${caseNumber}`;
        }else if(productionLevel == 'uat'){
            url = `${uatBaseUrl}:8080/trls-80/teacher_registrations/${caseNumber}`;
        }
    }
    try{
        const response = await fetch(`${url}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            }
        })
        return response.status;
    }catch (error) {
        console.error('Error deleting case:', error);
        return null;
    }

}